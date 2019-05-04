const fs = require('fs'),
crypto = require('crypto'),
mt = require('./mt'),
_ = require('lodash');

let str = '',
arr, obj = {};
obj.err = false;

const utils = {
  getdb: function(cnf, cb) {
    fs.access(cnf.url, fs.constants.F_OK, function(err) {
      if (err) {
        console.log('db not found, creating...')
        let arr = [];
        fs.writeFile(cnf.url, JSON.stringify(obj), function(err) {
          if (err) {
            console.log(err);
            cb(null);
          }
          cb(arr)
        })
      } else {
        fs.readFile(cnf.url, 'utf8', function(err, data) {
          if (err) {
            console.log(err);
            cb(null);
          }
          try {
            data = JSON.parse(data);
            cb(data);
            return;
          } catch (err) {
            if (err) {
              cb(null)
            }
          }
        })
      }
    });
  },
  savedb: function(data, cnf, cb) {
    if (cnf.pretty) {
      data = JSON.stringify(data, 0, 2)
    } else {
      data = JSON.stringify(data)
    }

    fs.writeFile(cnf.url, data, function(err) {
      if (err) {
        console.log(err);
        cb(null);
      }
      console.log('db updated')
      cb(true)
    })

  },
  getkey: function(store, id, cb) {
    if (typeof id !== 'number') {
      console.log('id must be an integer')
      cb(null);
    }
    try {
      let found = _.find(store, {
        id: id
      });
      if (typeof found !== 'object') {
        cb(null);
      } else {
        cb(found) //[0];
      }
    } catch (err) {
      if (err) {
        console.log(err);
        cb(null);
      }
    }
  },
  getkeydb: function(id, conf, cb) {
    if (typeof id !== 'number') {
      console.log('id must be an integer')
      cb(null);
    }
    try {
      utils.getdb(conf, function(res) {
        utils.getkey(res, id, function(i) {
          cb(i)
        })
      })
    } catch (err) {
      if (err) {
        console.log(err);
        cb(null);
      }
    }
  },
  addkey: function(store, key, cb) {
    if (typeof key !== 'object') {
      console.log('key and store must be an object')
      return null;
    }
    if (typeof key.id !== 'number') {
      console.log('id must be an integer')
      return null;
    }
    try {
      let found = _.find(store, {
        id: key.id
      });
      if (typeof found === 'object') {
        console.log('key id already exists')
        return null;
      } else {
        let res = store.push(key)
        cb(store);
      }
    } catch (err) {
      if (err) {
        console.log(err);
        return null;
      }
    }
  },
  addkeydb: function(key, cnf, cb) {
    utils.getdb(cnf, function(res) {
      utils.addkey(res, key, function(res) {
        utils.savedb(res, cnf, function(res) {
          cb(res)
        })
      })
    })
  },
  delkey: function(store, id, cb) {
    if (typeof id !== 'number') {
      console.log('id must be an integer')
      return null;
    }
    try {
      let found = _.reject(store, {
        id: id
      });
      if (typeof found !== 'object') {
        return null;
      } else {
        cb(found);
      }
    } catch (err) {
      if (err) {
        console.log(err);
        return null;
      }
    }
  },
  delkeydb: function(key, cnf, cb) {
    utils.getdb(cnf, function(res) {
      utils.delkey(res, key.id, function(res) {
        utils.savedb(res, cnf, function(res) {
          cb(res)
        })
      })
    })
  },
  arr2hex: function(list) {
    let arr = [];
    for (var i = 0; i < list.length; i++) {
      arr.push(list[i].toString(16));
    }
    return (arr.join(":"));
  },
  hex2arr: function(str) {
    let arr = [],
      list = str.split(/\s*:\s*/);
    for (var i = 0; i < list.length; i++) {
      arr.push(parseInt(list[i], 16));
    }
    return (arr);
  },
  str2arr: function(ptext) {
    try {
      let arr = [];
      for (i = 0; i <= ptext.length - 1; ++i) {
        arr.push((ptext[i] + "").charCodeAt(0));
      }
      return arr;
    } catch (err) {
      if (err) {
        console.log(err);
        return 'string error';
      }
    }
  },
  shreadfile: function(cnf, cb) {
    let timer = Date.now();
    fs.stat(cnf.url, function(err, stats) {
      if (err) {
        cb(false)
      }
      try {
        let size = stats.size,
          str = '',
          arr = [],
          step, step1, randData, RNDS = 0;

        for (step = 0; step < 5; step++) {
          randData = crypto.randomBytes(size + 1).toString()
          fs.writeFileSync(cnf.url, randData);
          RNDS++
        }

        for (step = 0; step < 5; step++) {
          str = ''
          for (step1 = 0; step1 < size + 1; step1++) {
            str += Math.round(mt.random() * 1)
          }
          fs.writeFileSync(cnf.url, parseInt(str));
          RNDS++
        }

        for (step = 0; step < 5; step++) {
          let randData = crypto.randomBytes(size).toString()
          fs.writeFileSync(cnf.url, randData);
          RNDS++
        }

        str = '';
        for (step = 0; step < size; step++) {
          str += 0
        }
        fs.writeFileSync(cnf.url, str);
        RNDS++

        console.log(RNDS + ' rounds done in ' + (Date.now() - timer) + 'ms')
        cb(step + ' rounds done');
      } catch (err) {
        if (err) {
          cb(false)
        }
      }
    });
  },
  gutfile: function(cnf, cb) {
    let timer = Date.now();
    fs.stat(cnf.url, function(err, stats) {
      if (err) {
        cb(false)
      }
      let size = stats.size,
        str = '',
        arr = [],
        step, step1, randData, RNDS = 0;

      for (step = 0; step < 10; step++) {
        randData = crypto.randomBytes(size + 1).toString()
        fs.writeFileSync(cnf.url, randData);
        RNDS++
      }

      for (step = 0; step < 7; step++) {
        str = ''
        for (step1 = 0; step1 < size + 1; step1++) {
          str += Math.round(mt.random() * 1)
        }
        fs.writeFileSync(cnf.url, parseInt(str));
        RNDS++
      }

      for (step = 0; step < 10; step++) {
        let randData = crypto.randomBytes(size / 2).toString('hex')
        fs.writeFileSync(cnf.url, randData);
        RNDS++
      }

      for (step = 0; step < 10; step++) {
        let randData = crypto.randomBytes(size).toString()
        fs.writeFileSync(cnf.url, randData);
        RNDS++
      }

      str = '';
      for (step = 0; step < size; step++) {
        str += 0
      }
      fs.writeFileSync(cnf.url, str);
      RNDS++

      console.log(RNDS + ' rounds done in ' + (Date.now() - timer) + 'ms')
      cb(step + ' rounds done');
    });
  },
  encGCM: function(key, data, cb) {
    try {
      let iv = crypto.randomBytes(16),
      salt = crypto.randomBytes(64);
      key = crypto.pbkdf2Sync(key, salt, 10000, 32, 'sha512');
      let cipher = crypto.createCipheriv('aes-256-gcm', key, iv),
      encrypted = Buffer.concat([
        cipher.update(data, 'utf8'), cipher.final()
      ]),
      tag = cipher.getAuthTag();
      obj.salt = salt.toString('hex');
      obj.data = Buffer.concat([iv, tag, encrypted]).toString('hex');
      cb(obj);
    } catch (err) {
      if(err){return null;}
    }
  },
  decGCM: function(key, data, salt, cb) {
    try {
      let bData = Buffer.from(data, 'hex');
      key = crypto.pbkdf2Sync(key, Buffer.from(salt, 'hex'), 10000, 32, 'sha512');
      let decipher = crypto.createDecipheriv('aes-256-gcm', key, bData.slice(0, 16));
      decipher.setAuthTag(bData.slice(16, 32));
      let decrypted = decipher.update(bData.slice(32), 'binary', 'utf8') + decipher.final('utf8');
      cb(decrypted);
    } catch (err) {
      if(err){return null;}
    }
  }
}



module.exports = utils;
