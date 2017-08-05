import fs from 'fs';

/**
 * Provides several utility methods for working with `package.json`.
 */
export default class PackageUtil
{
   /**
    * Get essential info for the given package object consistently formatted.
    *
    * @param {NPMPackageObject} packageObj - A loaded `package.json` object.
    *
    * @returns {NPMPackageData}
    */
   static format(packageObj = {})
   {
      let bugsURL, repoURL, scmType;

      // Sanity case to create empty object.
      if (packageObj === null || typeof packageObj === 'undefined')
      {
         packageObj = {};
      }

      // Parse repository URL.
      if (packageObj.repository)
      {
         repoURL = s_PARSE_URL(packageObj.repository.url ? packageObj.repository.url : packageObj.repository);
         scmType = s_PARSE_URL_SCM_TYPE(repoURL);
      }

      // Parse bugs URL.
      if (packageObj.bugs)
      {
         bugsURL = s_PARSE_URL(packageObj.bugs.url ? packageObj.bugs.url : packageObj.bugs);
      }

      /**
       * Creates NPMPackageData result.
       * @type {NPMPackageData}
       */
      const packageData =
      {
         name: packageObj.name,
         version: packageObj.version,
         description: packageObj.description,
         author: packageObj.author,
         homepage: packageObj.homepage,
         license: packageObj.license,
         main: packageObj.main,
         repository: { type: scmType, url: repoURL },
         bugs: { url: bugsURL }
      };

      let formattedMessage = '';

      if (packageData.name)
      {
         formattedMessage += `name: ${packageData.name}${packageData.version ? ` (${packageData.version})` : ''}`;
      }

      if (packageData.description) { formattedMessage += `\ndescription: ${packageData.description}`; }
      if (packageData.bugs.url) { formattedMessage += `\nbugs / issues: ${packageData.bugs.url}`; }
      if (packageData.repository.url) { formattedMessage += `\nrepository: ${packageData.repository.url}`; }
      if (packageData.homepage) { formattedMessage += `\nhomepage: ${packageData.homepage}`; }

      packageData.formattedMessage = formattedMessage;

      // Index info.

      return packageData;
   }

   /**
    * Attempts to load any associated `package.json` file from any NPM module detected in the first line of the
    * error trace.
    *
    * @param {Array<string>|Error} errOrTrace - A stack trace as an array of strings or error with stack trace to
    *                                           examine.
    *
    * @returns {NPMPackageData|undefined}
    */
   static formatFromError(errOrTrace)
   {
      // Covert any Error with a stack to an array of strings.
      if (errOrTrace instanceof Error && typeof errOrTrace.stack === 'string')
      {
         errOrTrace = errOrTrace.stack.split('\n');
      }

      let packageInfo;

      if (Array.isArray(errOrTrace))
      {
         // Walk through the stack trace array of strings until the first entry with a `node_modules` pattern is found
         // then attempt to parse that NPM module package.
         for (let cntr = 0; cntr < errOrTrace.length; cntr++)
         {
            // Matches full path to last NPM module, last node_module directory name
            const matches = (/^.*\((\/.*(\/node_modules\/(.*?)\/))/g).exec(`${errOrTrace[cntr]}`);

            const modulePath = matches !== null && matches.length >= 1 ? matches[1] : void 0;

            if (typeof modulePath === 'string')
            {
               try
               {
                  const packageObj = JSON.parse(fs.readFileSync(`${modulePath}package.json`, { encode: 'utf8' }));

                  packageInfo = PackageUtil.format(packageObj);

                  break;
               }
               catch (packageErr) { /* nop */ }
            }
         }
      }

      return packageInfo;
   }
}

/**
 * Creates several general utility methods bound to the eventbus.
 *
 * @param {PluginEvent}    ev - An event proxy for the main eventbus.
 */
export function onPluginLoad(ev)
{
   const eventbus = ev.eventbus;

   eventbus.on('typhonjs:util:package:object:format', PackageUtil.format, PackageUtil);
   eventbus.on('typhonjs:util:package:object:format:from:error', PackageUtil.formatFromError, PackageUtil);
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Parses an URL for Github SCM link.
 *
 * @param {string}   parseURL - URL to parse.
 *
 * @returns {string}
 * @ignore
 */
const s_PARSE_URL = (parseURL) =>
{
   let url;

   if (typeof parseURL === 'string')
   {
      if (parseURL.indexOf('git@github.com:') === 0)
      {
         // url: git@github.com:foo/bar.git
         const matched = parseURL.match(/^git@github\.com:(.*)\.git$/);

         if (matched && matched[1])
         {
            url = `https://github.com/${matched[1]}`;
         }
      }
      else if (parseURL.match(/^[\w\d\-_]+\/[\w\d\-_]+$/))
      {
         // url: foo/bar
         url = `https://github.com/${parseURL}`;
      }
      else if (parseURL.match(/^git\+https:\/\/github.com\/.*\.git$/))
      {
         // git+https://github.com/foo/bar.git
         const matched = parseURL.match(/^git\+(https:\/\/github.com\/.*)\.git$/);

         url = matched[1];
      }
      else if (parseURL.match(/(https?:\/\/.*$)/))
      {
         // other url
         const matched = parseURL.match(/(https?:\/\/.*$)/);

         url = matched[1];
      }
      else
      {
         url = '';
      }
   }

   return url;
};

/**
 * Parses an URL to determine SCM type; Github supported.
 *
 * @param {string}   scmURL - URL to parse.
 *
 * @returns {string|undefined}
 * @ignore
 */
const s_PARSE_URL_SCM_TYPE = (scmURL) =>
{
   let scmType;

   if (scmURL.match(new RegExp('^https?://github.com/')))
   {
      scmType = 'github';
   }

   return scmType;
};
