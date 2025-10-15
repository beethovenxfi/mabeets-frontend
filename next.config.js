/** @type {import('next').NextConfig} */
const path = require('path');
const transpiled = require('next-transpile-modules')(['echarts', 'zrender']);

const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: true,

    webpack(config) {
        config.resolve.alias['~'] = path.join(__dirname, 'src');
        return config;
    },

    async redirects() {
        return [
            {
                source: '/discord',
                destination: 'https://discord.gg/kbPnYJjvwZ',
                permanent: false,
            },
        ];
    },
};
module.exports = transpiled(nextConfig);
