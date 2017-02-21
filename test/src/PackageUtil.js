import { assert }    from 'chai';
import path          from 'path';

import PackageUtil   from '../../src/PackageUtil.js';

const packageObj = require(path.resolve(__dirname, '../../package.json'));

describe('PackageUtil:', () =>
{
   it('getPackageData:', () =>
   {
      const data = PackageUtil.getPackageData(packageObj);

      delete data.version;

      assert.strictEqual(JSON.stringify(data), verifyData);
   });

   it('getPackageDataFromError:', () =>
   {
      const data = PackageUtil.getPackageDataFromError([`at (${path.resolve('./node_modules/babel-runtime/core-js.js')})`]);

      delete data.version;

      assert.strictEqual(JSON.stringify(data), verifyErrData);
   });
});

const verifyData = '{"name":"typhonjs-package-util","description":"Provides several utility methods for working with `package.json`.","author":"typhonrt","homepage":"https://github.com/typhonjs-node-utils/typhonjs-package-util","license":"MPL-2.0","main":"dist/PackageUtil.js","repository":{"url":"https://github.com/typhonjs-node-utils/typhonjs-package-util"},"bugs":{"url":"https://github.com/typhonjs-node-utils/typhonjs-package-util/issues"},"formattedMessage":"name: typhonjs-package-util (0.0.1)\\ndescription: Provides several utility methods for working with `package.json`.\\nbugs / issues: https://github.com/typhonjs-node-utils/typhonjs-package-util/issues\\nrepository: https://github.com/typhonjs-node-utils/typhonjs-package-util\\nhomepage: https://github.com/typhonjs-node-utils/typhonjs-package-util"}';
const verifyErrData = '{"name":"babel-runtime","description":"babel selfContained runtime","author":{"name":"Sebastian McKenzie","email":"sebmck@gmail.com"},"license":"MIT","repository":{"url":"https://github.com/babel/babel/tree/master/packages/babel-runtime"},"bugs":{},"formattedMessage":"name: babel-runtime (6.23.0)\\ndescription: babel selfContained runtime\\nrepository: https://github.com/babel/babel/tree/master/packages/babel-runtime"}';
