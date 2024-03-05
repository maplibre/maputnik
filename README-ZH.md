<img width="200" alt="Maputnik logo" src="https://cdn.jsdelivr.net/gh/maputnik/design/logos/logo-color.png" />

# Maputnik
[![GitHub CI status](https://github.com/maplibre/maputnik/workflows/ci/badge.svg)][github-action-ci]
[![License](https://img.shields.io/badge/license-MIT-blue.svg)][license]

[github-action-ci]: https://github.com/maplibre/maputnik/actions?query=workflow%3Aci
[license]:          https://tldrlegal.com/license/mit-license

一款面地图向开发者和设计师的，免费开源且可视化的[MapLibre GL styles](https://maplibre.org/maplibre-style-spec/)样式编辑器。


## 如何使用

- 在线使用：在 **<https://www.maplibre.org/maputnik/>** 上设计 (所有数据只会存储在本地)
- 在线使用：使用[Maputnik CLI](https://github.com/maplibre/maputnik/wiki/Maputnik-CLI)进行本地风格开发
- 离线使用：在Docker环境下，运行此命令，并浏览http://localhost:8888  按Ctrl+C可停止服务。

```bash
docker run -it --rm -p 8888:80 ghcr.io/maplibre/maputnik:main
```

## 文档

文档可以在[Wiki](https://github.com/maplibre/maputnik/wiki)中找到。欢迎您的合作!

- wiki链接: **[Maputnik Wiki](https://github.com/maplibre/maputnik/wiki)**
- 视频教程: https://youtu.be/XoDh0gEnBQo

[![Design Map from Scratch](https://j.gifs.com/g5XMgl.gif)](https://youtu.be/XoDh0gEnBQo)

## 开发

Maputnik的技术栈是typescript、[React](https://github.com/facebook/react)和[MapLibre GL JS](https://maplibre.org/projects/maplibre-gl-js/)。

支持的Node.js可通过此处查阅：[所支持的LTS Node.js版本](https://github.com/nodejs/Release#release-schedule)。

### 如何参与
加入OSMUS的#maplibre或#maputnik slack频道:https://slack.openstreetmap.us/    获得邀请并阅读下面的指南，以便熟悉我们在这个项目是如何运作的。

下载依赖，启动服务并在浏览器上访问`http://localhost:8888/`网址。

```bash
# 下载依赖
npm install
# 启动服务
npm run start
```

如果你想在外部访问Maputnik，使用['——host '选项](https://vitejs.dev/config/server-options.html#server-host):

```bash
# 启动外部可访问的开发服务
npm run start -- --host 0.0.0.0
```
构建过程将监视文件系统的更改，重新构建并自动重新加载编辑器。

```
npm run build
```

检查JavaScript代码。

```
# 运行 linter
npm run lint
npm run lint-styles
```


## 测试
对于E2E测试，我们使用[Cypress](https://www.cypress.io/)

 [Cypress](https://www.cypress.io/)不会自己运行服务，所以你需要通过运行`npm run start`手动启动服务。

对于chrome浏览器，可以打开终端并使用运行以下命令:

```
npm run test
```
对于firefox浏览器，则需要使用以下命令:
```
npm run test -- --browser firefox
```

查看以下文档了解更多信息:(启动浏览器)[https://docs.cypress.io/guides/guides/launching-browsers]

你还可以在运行时查看测试，或者通过执行以下命令选择要运行的套件:

```
npm run cy:open
```


## 社区相关开源

- [maputnik-dev-server](https://github.com/nycplanning/labs-maputnik-dev-server) - 一个express.js服务，它可以快速地从任何mapboxGL地图加载样式到mapuntnik上。

## 赞助

感谢**[Kickstarter活动](https://www.kickstarter.com/projects/174808720/maputnik-visual-map-editor-for-mapbox-gl)**的支持者。如果没有这些商业和个人赞助商，这个项目是不可能实现的。
您可以查看原始Maputnik repo之前的赞助者的历史记录。
在 https://maplibre.org/sponsors/ 上阅读更多关于MapLibre赞助项目的信息。

## 许可证

Maputnik[根据MIT授权](授权)，版权归Lukas Martinelli和Maplibre贡献者所有。
作为贡献者，请格外注意不要侵犯任何Mapbox商标。不要从其他地图工作室获得灵感，做出你自己的选择，以去实现一个好的样式编辑器。
