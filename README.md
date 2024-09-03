# remix antd SSR 项目模板

## 技术栈

- remix2
- antd5
- ky
- i18next
- pm2
- docker
- istanbul
- tailwindcss

## 启动

```bash
npm run dev
```


## Docker部署

### 测试环境

```shell
# build
docker build --build-arg NODE_ENV=test -t antd-remix:1.0 .
# run
docker run -d -p 3000:3000 --name antd-remix antd-remix:1.0
```

### 正式环境

```shell
# build
docker build --build-arg NODE_ENV=production -t antd-remix:1.0 .
# run
docker run -d -p 3000:3000 --name antd-remix antd-remix:1.0
```
