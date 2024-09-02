module.exports = {
  apps: [
    {
      name: 'antd-remix-ssr',
      exec_mode: 'cluster',
      instances: 2,
      script: 'npm',
      args: 'start',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      node_args: '--harmony',
    },
  ],
}
