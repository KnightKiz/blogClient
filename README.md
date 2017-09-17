# blog

我的博客前端部分，由于腾讯云域名审查太麻烦又没给钱，每个月一块钱的学生优惠被取消了QAQ，等到时候搞到阿里的空间域名再放上去。

虽然模拟了数据，但是数据接口用的还是自家后台的数据api，url还是localhost没改，要想在本地测试需要
1.mysql环境，将blogServer仓库下的dataBase内的数据库备份文件还原
2.clone blogServer代码，然后npm install, npm start，要修改mysql配置，具体在config.js文件下，然后服务器会运行在localhost:8000
3.clone 此仓库（本项目么没有打包dist），npm install, npm run dev，该服务会运行在localhost:8080

下面为README.md文件原有的信息：

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
