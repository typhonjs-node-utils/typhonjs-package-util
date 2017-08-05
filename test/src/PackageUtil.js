import { assert }    from 'chai';
import path          from 'path';

import PackageUtil   from '../../src/PackageUtil.js';

const packageObj = require(path.resolve(__dirname, '../../package.json'));

const s_VERIFY_DATA = '{"name":"typhonjs-package-util","description":"Provides several utility methods for working with `package.json`.","author":"typhonrt","homepage":"https://github.com/typhonjs-node-utils/typhonjs-package-util","license":"MPL-2.0","main":"dist/PackageUtil.js","repository":{"type":"github","url":"https://github.com/typhonjs-node-utils/typhonjs-package-util"},"bugs":{"url":"https://github.com/typhonjs-node-utils/typhonjs-package-util/issues"},"formattedMessage":"name: typhonjs-package-util (0.0.3)\\ndescription: Provides several utility methods for working with `package.json`.\\nbugs / issues: https://github.com/typhonjs-node-utils/typhonjs-package-util/issues\\nrepository: https://github.com/typhonjs-node-utils/typhonjs-package-util\\nhomepage: https://github.com/typhonjs-node-utils/typhonjs-package-util"}';

describe('PackageUtil:', () =>
{
   it('format:', () =>
   {
      const data = PackageUtil.format(packageObj);

      delete data.version;

      assert.strictEqual(JSON.stringify(data), s_VERIFY_DATA);
   });

   it('formatFromError:', () =>
   {
      const data = PackageUtil.formatFromError([`at (${path.resolve('./node_modules/babel-runtime/core-js.js')})`]);

      assert.strictEqual(data.name, 'babel-runtime');
   });
});
