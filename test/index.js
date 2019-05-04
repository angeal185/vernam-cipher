

// add key to db

otp.getDB(cnf, function(res){
  otp.addKey(res, newkey, function(res){
    otp.saveDB(res, cnf, function(res){
      console.log(res)
    })
  })
})

otp.addKeyDB(newkey, cnf, function(res){
  console.log(res)
})



//delete key from db
otp.getDB(cnf, function(res){
  otp.delKey(res, newkey.id, function(res){
    otp.saveDB(res, cnf, function(res){
      console.log(res)
    })
  })
})

otp.delKeyDB(newkey, cnf, function(res){
  console.log(res)
})


//gut filte
otp.gutFile(cnf, function(i){
  //console.log(i)
})

//shread file
otp.gutFile(cnf, function(i){
  //console.log(i)
})
