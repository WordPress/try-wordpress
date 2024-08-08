const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function (env) {
    // We must always build for production because the development builds will have unsafe-eval in the code, which the
    // browsers don't like.
    const mode = 'production';

    let modules = [];
    for (const target of ['firefox', 'chrome']) {
        const targetPath = path.resolve(__dirname, 'build', target);
        modules = modules.concat([
            {
                mode,
                entry: './src/background/index.js',
                output: {
                    path: targetPath,
                    filename: path.join('background', 'index.js'),
                },
                plugins: [
                    new CopyPlugin({
                        patterns: [
                            {from: `./src/manifest-${target}.json`, to: path.join(targetPath, 'manifest.json')},
                            {from: './src/icons', to: path.join(targetPath, 'icons')},
                        ],
                    }),
                ],
            },
            {
                mode,
                entry: './src/content/index.js',
                output: {
                    path: targetPath,
                    filename: path.join('content', 'index.js'),
                },
            },
            {
                mode,
                entry: './src/sidebar/sidebar.js',
                output: {
                    path: targetPath,
                    filename: path.join('sidebar', 'sidebar.js'),
                },
                plugins: [
                    new CopyPlugin({
                        patterns: [
                            {from: 'src/sidebar/sidebar.html', to: path.join(targetPath, 'sidebar', 'sidebar.html')},
                            {from: 'src/sidebar/sidebar.css', to: path.join(targetPath, 'sidebar', 'sidebar.css')},
                        ],
                    }),
                ],
            },
        ]);
    }

    return modules;
};
