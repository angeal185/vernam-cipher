const _ = require('lodash'),
utils = require('./utils'),
fs = require('fs'),
mt = require('./mt');




function OTP(){

  const defaults = {
    treshold: 150,
    keybuff: false,
    buff: false
  }

  let str = '',
  arr, obj = {};
  obj.err = false;



  function kgen(data, conf){
    try {
      data = utils.str2arr(data)
      arr = [];
      for (i = 0; i <= data.length -1; ++i){
        arr.push(Math.round(mt.random() * defaults.treshold));
      }
      obj.data = utils.arr2hex(data);
      obj.key = utils.arr2hex(arr);
      console.log(obj)
      return obj;
    } catch (err) {
      console.log(err);
      obj.err = 'keygen error';
      return obj;
    }
  }

  function ksgen(algo, ){
    try {

        obj.keyList = {};
        obj.keys = 0;


      return obj;
    } catch (err) {
      console.log(err);
      obj.err = 'key store gen error';
      return obj;
    }
  }






  function encrypt(key, chal, conf){
    try {
      key = utils.hex2arr(key);
      chal = utils.hex2arr(chal);
      arr = [];
      for (i = 0; i <= key.length -1; ++i){
        arr.push(key[i] ^ chal[i]);
      }
      obj.data = utils.arr2hex(arr);
      return obj;
    } catch (err) {
      console.log(err);
      obj.err = 'encrypt error';
      return obj;
    }

  }

  function decrypt(chal, enc, conf){
    try {
      chal = utils.hex2arr(chal);
      enc = utils.hex2arr(enc);
      for (i = 0; i <= chal.length - 1; ++i){
        let char = (enc[i] ^ chal[i]);
        str += String.fromCharCode(char);
      }
      obj.data = str;
      return str;
    } catch (err) {
      console.log(err);
      obj.err = 'decrypt error';
      return obj;
    }

  }

  return {
    keygen: function(data, conf, cb){
      if(typeof conf === 'function' && !cb){
        cb = conf;
        conf = defaults;
      }
      cb(kgen(data));
    },
    enc: function(key, chal, conf, cb){
      if(typeof conf === 'function' && !cb){
        cb = conf;
        conf = defaults;
      }
      cb(encrypt(key, chal));
    },
    dec: function(chal, enc, conf, cb){
      if(typeof conf === 'function' && !cb){
        cb = conf;
        conf = defaults;
      }
      cb(decrypt(chal, enc));
    },
    addKey: function(store, key, cb){
      utils.addkey(store, key, cb)
    },
    addKeyDB: function(key, conf, cb){
      utils.addkeydb(key, conf, cb)
    },
    getKey: function(store, id, cb){
      cb(utils.getkey(store, id))
    },
    getKeyDb: function(id, conf, cb){
      utils.getkeydb(id, conf, cb)
    },
    getDB: function(url, cb){
      utils.getdb(url, cb)
    },
    saveDB: function(store, conf, cb){
      utils.savedb(store, conf, cb)
    },
    delKey: function(store, id){

      cb(utils.delkey(store, id))
    },
    delKeyDB: function(key, conf, cb){
      utils.delkeydb(key, conf, cb)
    },
    gutFile: function(conf, cb){
      utils.gutfile(conf,cb)
    },
    keygenSync: function(data, conf){
      return kgen(data);
    },
    encSync: function(key, chal, conf){
      return encrypt(key, chal);
    },
    decSync: function(chal, enc, conf){
      return decrypt(chal, enc);
    },
    keygenP: function(data, conf){
      if(!conf){
        conf = defaults;
      }
      return new Promise(function(resolve, reject){
        res = kgen(data);
        if(res.err){
          reject(res.err);
        } else {
          delete res.err;
          resolve(res);
        }
      })
    },
    encP: function(key, chal){
      if(!conf){
        conf = defaults;
      }
      return new Promise(function(resolve, reject){
        res = encrypt(key, chal);
        if(res.err){
          reject(res.err);
        } else {
          delete res.err;
          resolve(res.data);
        }
      })
    },
    decP: function(chal, enc){

      if(!conf){
        conf = defaults;
      }
      return new Promise(function(resolve, reject){
        res = decrypt(chal, enc);
        if(res.err){
          reject(res.err);
        } else {
          delete res.err;
          resolve(res.data);
        }
      })

    }
  }
}
const otp = new OTP();


/*
let data = 'testing us'
otp.keygen(data, function(i){
  console.log(i)

  otp.encrypt(i.data, i.key, function(res){

    otp.decrypt(i.key, res.data, function(text){
      console.log(text)
    })

  })

})
*/

let ks = [{
  id: 1,
  key: 'hello'
},{
  id: 3,
  key: 'hello2'
}]
/*
otp.delKey(ks, 1, function(res){
  console.log(res)
})
*/

let newkey = {
  id: 5,
  key: 'hello'
}

let cnf = {
  url: './test.json',
  pretty: true
}

utils.encGCM('password', 'test', function(i){
  //console.log(i)
  utils.decGCM('password', i.data, i.salt, function(i){
    console.log(i)
  })
})


/*
otp.getKeyDb(6, cnf, function(i){
  console.log(i)
})
*/
/*
otp.addKeyDB(newkey, cnf, function(res){
  console.log(res)
})
*/


/*

*/

/*
// add key to db
otp.addKeyDB(newkey, cnf, function(res){
  console.log(res)
})

*/
//console.log(getKey(36));
/*
let newkey = {
  id: 5,
  key: 'hello'
}
console.log(addkey(ks, newkey))


let ptext = "test",
baseKey = otp.str2arr(ptext),
chalKey = otp.keygen(baseKey),
enc = otp.encrypt(baseKey, chalKey),
dec = otp.decrypt(baseKey, chalKey, enc);

let obj = {
  baseKey: baseKey,
  chalKey: chalKey,
  enc: enc,
  dec: dec
}

console.log(obj)
*/
