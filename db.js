const sqlite3 = require("sqlite3").verbose();
const dbname = process.env.DB_NAME;
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname);

// 错误表字段
const errorKeys = `apikey,breadcrumb,column,deviceInfo,fileName,line,message,pageUrl,recordScreenId,sdkVersion,status,time,type,userId,uuid,mapVersion`;
// 记录表字段
const recordScreenKeys = `apikey,type,recordScreenId,time,status,events,userId,sdkVersion,uuid,pageUrl,deviceInfo,mapVersion`;
// 白屏表字段
const whiteScreenKeys = `apikey,type,time,status,userId,sdkVersion,uuid,pageUrl,deviceInfo,mapVersion`;
// performance表字段
const performanceKeys = `apikey,type,time,status,userId,sdkVersion,uuid,pageUrl,deviceInfo,longTask,name,mapVersion`;

// 创建一个project表
db.serialize(() => {
  // projects
  const projectSql = `
        CREATE TABLE IF NOT EXISTS projects
        (id integer primary key,name,token,mapVersion TEXT)
    `;
  // 如果没有projects表,创建一个
  db.run(projectSql);

  // errors
  const errorSql = `
        CREATE TABLE IF NOT EXISTS errors
        (id integer primary key, ${errorKeys} TEXT)
    `;
  // 如果没有error表,创建一个
  db.run(errorSql);

  // records
  const recordScreensSql = `
        CREATE TABLE IF NOT EXISTS recordScreens
        (id integer primary key, ${recordScreenKeys} TEXT)
    `;
  // 如果没有record表,创建一个
  db.run(recordScreensSql);

  // whiteScreen
  const whiteScreenSql = `
        CREATE TABLE IF NOT EXISTS whiteScreens
        (id integer primary key, ${whiteScreenKeys} TEXT)
    `;
  // 如果没有record表,创建一个
  db.run(whiteScreenSql);

  // performance
  const performanceSql = `
        CREATE TABLE IF NOT EXISTS performances
        (id integer primary key, ${performanceKeys} TEXT)
    `;
  // 如果没有record表,创建一个
  db.run(performanceSql);
});

// project API
class Projects {
  // 获取所有项目
  static all(cb) {
    // 使用sqlite3的all
    db.all("SELECT * FROM projects", cb);
  }
  // 根据id 获取项目
  static find(id, cb) {
    // 使用sqlite3的get
    db.get("SELECT * FROM projects WHERE id = ?", id, cb);
  }
  // 根据 token 获取项目
  static findBytoken(token, cb) {
    // 使用sqlite3的get
    db.get("SELECT * FROM projects WHERE token = ?", token, cb);
  }
  // 添加一个条项目记录
  static create(data, cb) {
    const sql = `
                INSERT INTO
                projects(name,token,mapVersion)
                VALUES(?,?,?)
                ;select last_insert_rowid();`;
    db.run(sql, data.name, data.token, data.mapVersion, cb);
  }
  // 删除一个项目
  static delete(id, cb) {
    if (!id) return cb(new Error(`缺少参数id`));
    db.run("DELETE FROM projects WHERE id=?", id, cb);
  }
  // 更新一个项目数据
  static update(data, cb) {
    const sql = `
            UPDATE projects
            SET mapVersion=?
            WHERE token=?
        `;
    db.run(sql, data.mapVersion, data.token, cb);
  }
}
// error API
class Errors {
  // 获取所有项目
  static all(apikey, cb) {
    // 使用sqlite3的all
    db.all("SELECT * FROM errors WHERE apikey = ?", apikey, cb);
  }
  // 根据id 获取项目
  static find(id, cb) {
    // 使用sqlite3的get
    db.get("SELECT * FROM errors WHERE id = ?", id, cb);
  }
  // 添加一个条项目记录
  static create(data, cb) {
    const sql = `
                INSERT INTO
                errors(${errorKeys})
                VALUES(${new Array(errorKeys.split(",").length)
                  .fill("?")
                  .join(",")})
                ;select last_insert_rowid();`;
    db.run(
      sql,
      data.apikey,
      data.breadcrumb,
      data.column,
      data.deviceInfo,
      data.fileName,
      data.line,
      data.message,
      data.pageUrl,
      data.recordScreenId,
      data.sdkVersion,
      data.status,
      data.time,
      data.type,
      data.userId,
      data.uuid,
      data.mapVersion,
      cb
    );
  }
  // 删除一个项目
  static delete(id, cb) {
    if (!id) return cb(new Error(`缺少参数id`));
    db.run("DELETE FROM errors WHERE id=?", id, cb);
  }
  // 更新一个项目数据
  static update(data, cb) {
    const sql = `
            UPDATE errors
            SET name=?,token=?
            WHERE id=?
        `;
    db.run(sql, data.name, data.token, data.id, cb);
  }
}
// record API
class RecordScreens {
  // 获取所有项目
  static all(cb) {
    // 使用sqlite3的all
    db.all("SELECT * FROM recordScreens", cb);
  }
  // 根据id 获取项目
  static find(id, cb) {
    // 使用sqlite3的get
    try {
      db.get("SELECT * FROM recordScreens WHERE recordScreenId = ?", id, cb);
    } catch (error) {
      console.log("查找视频失败:", error);
    }
  }
  // 添加一个条项目记录
  static create(data, cb) {
    const sql = `
                INSERT INTO
                recordScreens(${recordScreenKeys})
                VALUES(${new Array(recordScreenKeys.split(",").length)
                  .fill("?")
                  .join(",")})
                ;select last_insert_rowid();`;
    try {
      db.run(
        sql,
        data.apikey,
        data.type,
        data.recordScreenId,
        data.time,
        data.status,
        data.events,
        data.userId,
        data.sdkVersion,
        data.uuid,
        data.pageUrl,
        data.deviceInfo,
        data.mapVersion,
        cb
      );
    } catch (error) {
      console.log("添加一个条项目记录error:", error);
    }
  }
  // 删除一个项目
  static delete(id, cb) {
    if (!id) return cb(new Error(`缺少参数id`));
    db.run("DELETE FROM recordScreens WHERE id=?", id, cb);
  }
  // 更新一个项目数据
  static update(data, cb) {
    const sql = `
            UPDATE recordScreens
            SET name=?,token=?
            WHERE id=?
        `;
    db.run(sql, data.name, data.token, data.id, cb);
  }
}
// whiteScreen API
class WhiteScreens {
  // 获取所有项目
  static all(cb) {
    // 使用sqlite3的all
    db.all("SELECT * FROM whiteScreens", cb);
  }
  // 根据id 获取项目
  static find(id, cb) {
    // 使用sqlite3的get
    db.get("SELECT * FROM whiteScreens WHERE id = ?", id, cb);
  }
  // 添加一个条项目记录
  static create(data, cb) {
    const sql = `
                INSERT INTO
                whiteScreens(${whiteScreenKeys})
                VALUES(${new Array(whiteScreenKeys.split(",").length)
                  .fill("?")
                  .join(",")})
                ;select last_insert_rowid();`;
    db.run(
      sql,
      data.apikey,
      data.type,
      data.time,
      data.status,
      data.userId,
      data.sdkVersion,
      data.uuid,
      data.pageUrl,
      data.deviceInfo,
      data.mapVersion,
      cb
    );
  }
  // 删除一个项目
  static delete(id, cb) {
    if (!id) return cb(new Error(`缺少参数id`));
    db.run("DELETE FROM whiteScreens WHERE id=?", id, cb);
  }
  // 更新一个项目数据
  static update(data, cb) {
    const sql = `
            UPDATE whiteScreens
            SET name=?,token=?
            WHERE id=?
        `;
    db.run(sql, data.name, data.token, data.id, cb);
  }
}

// performance API
class Performances {
  // 获取所有项目
  static all(cb) {
    // 使用sqlite3的all
    db.all("SELECT * FROM performances", cb);
  }
  // 根据id 获取项目
  static find(id, cb) {
    // 使用sqlite3的get
    db.get("SELECT * FROM performances WHERE id = ?", id, cb);
  }
  // 添加一个条项目记录
  static create(data, cb) {
    const sql = `
                INSERT INTO
                performances(${performanceKeys})
                VALUES(${new Array(performanceKeys.split(",").length)
                  .fill("?")
                  .join(",")})
                ;select last_insert_rowid();`;
    db.run(
      sql,
      data.apikey,
      data.type,
      data.time,
      data.status,
      data.userId,
      data.sdkVersion,
      data.uuid,
      data.pageUrl,
      data.deviceInfo,
      data.longTask,
      data.name,
      data.mapVersion,
      cb
    );
  }
  // 删除一个项目
  static delete(id, cb) {
    if (!id) return cb(new Error(`缺少参数id`));
    db.run("DELETE FROM performances WHERE id=?", id, cb);
  }
  // 更新一个项目数据
  static update(data, cb) {
    const sql = `
            UPDATE performances
            SET name=?,token=?
            WHERE id=?
        `;
    db.run(sql, data.name, data.token, data.id, cb);
  }
}

module.exports.Projects = Projects;
module.exports.Errors = Errors;
module.exports.RecordScreens = RecordScreens;
module.exports.WhiteScreens = WhiteScreens;
module.exports.Performances = Performances;
