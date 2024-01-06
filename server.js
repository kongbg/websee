const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const coBody = require("co-body");
const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` }); // 将.env.***配置挂载到process上

// 删除文件夹以及文件夹里的文件
const deleteFolder = (path) => {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

// 统一处理返回信息
const BaseController = require("./src/utils/BaseController");

// sqlite3
const {
  Projects,
  Errors,
  RecordScreens,
  WhiteScreens,
  Performances,
} = require("./db");

// 创建静态服务
const serveStatic = require("serve-static");
const rootPath = path.join(__dirname, "dist");
app.use(serveStatic(rootPath));

// 开启上传
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// 处理body参数格式
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// 跨域
app.all("*", function (res, req, next) {
  req.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Headers", "Content-Type");
  req.header("Access-Control-Allow-Methods", "*");
  req.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 获取项目列表
app.get("/api/projects/get", (req, res, next) => {
  Projects.all((err, data) => {
    if (err) {
      res.send(BaseController.renderJsonWarn(400, "获取失败！", { data: [] }));
    } else {
      res.send(BaseController.renderJsonWarn(200, "获取成功！", { data }));
    }
  });
});
// 新增项目
app.post("/api/projects/add", (req, res, next) => {
  let { name, adminToken } = req.body;
  let token = adminToken || `${new Date().getTime()}`;
  let mapVersion = 0;
  Projects.create({ name, token, mapVersion }, (err, data) => {
    if (err) {
      res.send(BaseController.renderJsonWarn(400, "新增失败！", null));
    } else {
      res.send(BaseController.renderJsonWarn(200, "新增成功！", null));
    }
  });
});
// 新增项目
app.post("/api/projects/delete", (req, res, next) => {
  let { id } = req.body;
  Projects.delete(id, (err, data) => {
    if (err) {
      res.send(BaseController.renderJsonWarn(400, "删除失败！", null));
    } else {
      res.send(BaseController.renderJsonWarn(200, "删除成功！", null));
    }
  });
});
// 上传功能
app.post("/api/upload", async (req, res) => {
  let { file, name, apikey, mapVersion } = req.body;
  let getDirName = path.dirname;
  function writeFile(path, contents, cb) {
    fs.mkdir(getDirName(path), { recursive: true }, function (err) {
      if (err) return cb(err);
      fs.writeFile(path, contents, cb);
    });
  }
  try {
    if (!file) {
      res.send(
        BaseController.renderJsonWarn(400, "没获取到文件！", { data: null })
      );
    } else {
      let uploadPath = path.resolve(__dirname, `uploads`);
      writeFile(`${uploadPath}/${apikey}/${mapVersion}/${name}`, JSON.parse(file), (err) => {
        console.log(`${name}数据已成功写入文件`);
      });
      res.send(
        BaseController.renderJsonWarn(200, "上传成功！", { data: null })
      );
    }
  } catch (err) {
    res.send(BaseController.renderJsonWarn(400, "上传失败！", { data: null }));
  }
});
// 删除map文件
app.post("/api/clearMapByToken", (req, res, next) => {
  let { apikey } = req.body;
  let uploadPath = path.resolve(__dirname, `uploads`);
  // 删除上个版本map文件
  deleteFolder(`${uploadPath}/${apikey}`);
  res.send(BaseController.renderJsonWarn(200, "删除成功！", { data: null }));
});
// 检查当前版本SourceMap是否存在
app.get("/api/checkVersionExists", (req, res, next) => {
  let { apikey, version } = req.query;
  let sourcePath = path.resolve(__dirname, `uploads/${apikey}/${version}`);
  let exists = checkDirectoryExists(sourcePath);
  if (exists) {
    res.send(BaseController.renderJsonWarn(200, "检查成功！", { data: {exists} }));
  } else {
    Projects.update({ token: apikey, mapVersion: version }, (err) => {
      if(!err) {
        res.send(BaseController.renderJsonWarn(200, "更新成功！", { data: {exists, appVersion: version} }));
      } else {
        res.send(BaseController.renderJsonWarn(400, "更新失败！", { data: err}));
      }
    })
  }
})
// 获取最新版本
app.get("/api/getSourceMapVersion", (req, res, next) => {
  let { apikey } = req.query;
  Projects.findBytoken(apikey, (err, data) => {
    if (!err) {
      let mapVersion = Number(data.mapVersion) + 1;
      Projects.update({ token: apikey, mapVersion }, (err2) => {
        if(!err2) {
          res.send(BaseController.renderJsonWarn(200, "获取成功！", { data: {mapVersion} }));
        } else {
          res.send(BaseController.renderJsonWarn(400, "获取失败！", { data: err2}));
        }
      })
    } else {
      res.send(BaseController.renderJsonWarn(400, "获取失败！", { data: err}));
    }
  });
});
// 获取js.map源码文件
app.get("/api/getmap", (req, res) => {
  let { fileName, apikey, mapVersion } = req.query;

  let mapFilePath = `uploads/${apikey}/${mapVersion}`;
  // let mapFilePath = 'dist/js';

  let mapFile = path.join(__filename, "..", mapFilePath);
  // 拿到dist目录下对应map文件的路径
  let mapPath = path.join(mapFile, `${fileName}.map`);
  fs.readFile(mapPath, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});
// 获取错误列表
app.get("/api/getErrorList", (req, res) => {
  let { apikey } = req.query;
  if(!apikey) {
    return  res.send(BaseController.renderJsonWarn(400, "apikey不能为空！", { data: null }));
  }
  Errors.all(apikey, (err, data) => {
    if (err) {
      res.send(BaseController.renderJsonWarn(400, "获取失败！", { data: [] }));
    } else {
      (data||[]).forEach((item) => {
        if (item.breadcrumb) item.breadcrumb = JSON.parse(item.breadcrumb);
        if (item.deviceInfo) item.deviceInfo = JSON.parse(item.deviceInfo);
        if (item.longTask) item.longTask = JSON.parse(item.longTask);
      });
      res.send(BaseController.renderJsonWarn(200, "获取成功！", { data }));
    }
  });
});
// 查看报错源码
app.get("/api/getRecordScreenId", async (req, res) => {
  let id = req.query.id;
  RecordScreens.find(id, (err, data) => {
    if (!err) {
      res.send(BaseController.renderJsonWarn(200, "获取成功！", { data }));
    } else {
      res.send(BaseController.renderJsonWarn(400, "获取失败！", { data: [] }));
    }
  });
});
// 上传报错
app.post("/api/reportData", async (req, res) => {
  let sendInfo = {
    code: 200,
    meaage: "上报成功！",
  };
  let dbMaps = {
    performance: Performances,
    recordScreen: RecordScreens,
    whiteScreen: WhiteScreens,
  };

  try {
    // req.body 不为空时为正常请求，如录屏信息
    let length = Object.keys(req.body).length;
    let data = {};
    if (length) {
      data = req.body;
      data.type = "recordScreen";
    } else {
      // 使用 web beacon 上报数据
      data = await coBody.json(req);
    }

    if (!data) return;
    if (data.breadcrumb) data.breadcrumb = JSON.stringify(data.breadcrumb);
    if (data.deviceInfo) data.deviceInfo = JSON.stringify(data.deviceInfo);
    if (data.longTask) data.longTask = JSON.stringify(data.longTask);
    if (data.resourceList) data.resourceList = JSON.stringify(data.resourceList);
    if (data.memory) data.memory = JSON.stringify(data.memory);

    // console.log(data.type, data)

    let dbModel = dbMaps[data.type] || Errors;
    let { err, res } = await dbModel.create({ ...data });
    if (err) {
      sendInfo = BaseController.renderJsonWarn(400, "上报失败！", {
        data: err,
      });
    } else {
      sendInfo = BaseController.renderJsonWarn(200, "上报成功！", {
        data: res,
      });
    }
    res.send(sendInfo);
  } catch (err) {
    res.send(BaseController.renderJsonWarn(400, "上报失败！", { data: err }));
  }
});


function checkDirectoryExists(directoryPath) {
  try {
    fs.accessSync(directoryPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

// 启动服务
app.listen(process.env.VUE_APP_NODE_PORT, () => {
  console.log(`Server is running at http://${process.env.VUE_APP_NODE_HOST}:${process.env.VUE_APP_NODE_PORT}`);
});
