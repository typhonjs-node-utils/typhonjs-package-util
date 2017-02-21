var code = `
/**
 * @external {NPMPackageData} https://docs.typhonjs.io/typhonjs-node-utils/typhonjs-package-util/typedef/index.html#static-typedef-NPMPackageData
 */

/**
 * @external {NPMPackageObject} https://docs.typhonjs.io/typhonjs-node-utils/typhonjs-package-util/typedef/index.html#static-typedef-NPMPackageObject
 */
`;

exports.onHandleVirtual = function(ev)
{
   ev.data.code.push({ code, message: __filename });
};
