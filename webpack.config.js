const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = function (env) {
    const mode = env.env === 'production' ? 'production' : 'development';

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
