

function dragover (e)
  {
      e.preventDefault();
    console.log("dragged over !");
  }

  function dragstart(e)
{

  e.dataTransfer.setData("id",e.target.id);
  console.log("dragged start !");
}

function dragover(e)
{
    e.preventDefault();
  console.log("dragged over !");
}

function drop(e)
{

    var id= e.dataTransfer.getData("id");
    console.log(id);
    console.log("droppppppppppp");
    e.target.appendChild(document.getElementById(id));
     e.preventDefault();
        user.updateList(id);

  console.log("drop !");
}


function notdrop(e)
{

    var id= e.dataTransfer.getData("id");
    e.target.appendChild(document.getElementById(id));
     e.preventDefault();
        user.updateList2(id);

  console.log("drop !");
}



    var db = openDatabase("todoDb", "1.0", "My Description", 1 * 1024 * 1024);
    var user = {
        createTableUser: function() {
            db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE  IF  NOT EXISTS userdata(name,email,pass)");
            });
        },

        dropTable: function(ns) {
            db.transaction(function(tx) {
                tx.executeSql('DROP TABLE ' + ns, [], function(tx, res) {});
            });
        },

        createTableMylist: function() {
            db.transaction(function(tx) {
                tx.executeSql("CREATE TABLE  IF NOT EXISTS mylist(user_id,title,description,status,date DATETIME,FOREIGN KEY (user_id) REFERENCES userdata (rowid))");
            });
        },
        updateList: function(title) {
            db.transaction(function(tx) {

                tx.executeSql("UPDATE  mylist SET status='completed' WHERE title=?", [title]);
            })


        },
        updateList2: function(title) {
            db.transaction(function(tx) {

                tx.executeSql("UPDATE  mylist SET status='notcompleted' WHERE title=?", [title]);
            })


        },

        insertList: function(title, description, status, user_id, date) {
            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO mylist  VALUES(?,?,?,?,?)", [user_id, title, description, status, date]);
            });
        },

        insertUser: function(user) {
            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO userdata  VALUES(?,?,?)", [user.name, user.email, user.pass]);
            });
        },
        search: function(email, pass) {
            return new Promise(function(resolve, reject) {
                // console.log(email);
                // console.log(" inside promise");

                // console.log(db);
                db.transaction(function(tx) {
                    // console.log(" insed transaction");
                    tx.executeSql("select rowid from userdata where email=? and pass=?", [email, pass], function(tx, res) {
                        if (res) {
                            if (res.rows.length == 0) {
                                console.log("data not found");
                                resolve({
                                    staus: 'error',
                                    data: 'There is no actions '
                                });
                                // alert("not found ");
                                var alert = " <div class='alert alert-danger alert-dismissable'>\
    <a href=''#' class='close' data-dismiss='alert' aria-label='close' height='100px' >X</a>\
    <strong>Danger!</strong> user is not found .\
  </div>";
                                $('.alertmesg').append(alert).fadeIn("slow");

                            } else {
console.log(res.rows);
                                for (var i = 0; i < res.rows.length; i++) {
                                    var user_id = res.rows[i].rowid

                                }
                                console.log(user_id);
                                // localStorage.setItem('user',user_id);
                                localStorage.setItem('user_id',user_id);


                                //-----------------------------------------
                                user.getAllList(user_id).then(function(res) {

                                        console.log(res.data);
                                        user.renderList(res.data);

                                    },
                                    function(err) {
                                        console.log(err)

                                    });

                                //------------------------------------------------------------





                                console.log("data found");
                                resolve({
                                    staus: 'success',
                                    data: res.rows
                                });
                                // location.href='test.html';
                            }
                        } else {
                            console.log("wrong query");
                            reject('an error has been occured');
                        }
                    });
                });
            });
        },


        deleteList: function(title) {
            console.log(title);

            db.transaction(function(tx) {

                console.log('del 2');

                tx.executeSql("DELETE FROM mylist  WHERE title=?", [title]);
            })

        },
        deleteList2: function(title) {
            console.log(title);

            db.transaction(function(tx) {

                console.log('del 2');

                tx.executeSql("DELETE FROM mylist  WHERE title=?", [title]);
            })

        },
        details: function(title) {
            db.transaction(function(tx) {
                tx.executeSql("SELECT title,description,status FROM mylist  WHERE title=?", [title], function(tx, res) {

                    if (res) {

                        if (res.rows.length) {
                            for (var i = 0; i < res.rows.length; i++) {
                                var detalis = " <div class ='detalis alert alert-warning' id=\"" + res.rows[i].title + "\" >\
                                <p>Title: \"" + res.rows[i].title + "\"<p>\
                      <p> description: " + res.rows[i].description + "<p>\
                      <p>status: " + res.rows[i].status + "<p>\
                        <p>date: " + res.rows[i].date + "<p>\
                      <button class='dell  btn btn-danger glyphicon glyphicon-trash'></button>\
                      <button class='back  btn btn-warning '> back</button>\
                       </div>";

                                $('.complete').hide();
                                $('.notcomplete').hide();
                                $('.addit').hide();
                                $('.detailss').show();
                                $('.detailss').append(detalis);
                                $('#logout').show();
                            }

                            $('body').on('click', '.dell', function() {
                                for (var i = 0; i < res.rows.length; i++) {
                                    var id = res.rows[i].title;
                                }

                                var r = confirm("Are yOu sure!");

                                    if (r == true) {

                                //  console.log(id);
                                $(this).parent().remove();
                                user.deleteList2(id);
                                $('.delback').show();
                                $('.delback').append("<button class='back  btn btn-warning '> back</button>");
                                            }

                                else{

                                  $('.complete').hide();
                                  $('.notcomplete').hide();
                                  $('.addit').hide();
                                  $('.detailss').show();
                                  $('#logout').show();
                                }
                            });




                        }

                    } else {

                        reject("an error has been ");
                    }






                });
            })

            $('body').on('click', '.back', function() {

                $('.complete').show();
                $('.notcomplete').show();
                $('.addit').show();
                $('.detailss').hide();
                $('#logout').show();
            });



        },

        getAllList: function(user_id) {
            return new Promise(function(resolve, reject)

                {
                    db.transaction(function(tx) {
                        tx.executeSql("SELECT * FROM  mylist where user_id=?", [user_id], function(tx, res) {
                            if (res) {

                                if (!res.rows.length) {

                                    reject({
                                        status: "error",
                                        message: "data not retrive"
                                    })
                                } else {
                                    resolve({
                                        status: "sucess",
                                        data: res.rows
                                    });

                                }
                            } else {

                                reject("an error has been ");
                            }
                        });
                    })

                });
        },

        searchList:function(title)
        {
        return new Promise(function(resolve,reject)

          {
           db.transaction(function(tx){
           tx.executeSql("SELECT * FROM  mylist WHERE title=?",[title],function(tx,res){
            if(res){

                              if(!res.rows.length)
                              {

                                reject({status:"error",message:"data not retrive"})
                              }
                              else
                              {
                                resolve({status:"sucess",data:res.rows});

                              }
                          }
              else{

                 reject("an error has been ");
                }
                                 });
                            })

                })},
        renderList: function(todo) {

            for (var i = 0; i < todo.length; i++) {


                var data = "<div  class='comp edit' id=\"" + todo[i].title + "\" ondragstart='dragstart(event)' draggable='true'>\
        <div><h3>Title: " + todo[i].title + "</h3>\
        <h4>Description:" + todo[i].description + "</h4>\
        <h4> Date:" + todo[i].date + "</h4>\
        </div>\
        <button class='update btn btn-warning'> update</button>\
        <button class='details btn btn-success'> details</button>\
        <button class='del  btn btn-danger glyphicon glyphicon-trash' ></button>\
        </div>";

                var data2 = "<div  class='notcomp edit' id=\"" + todo[i].title + "\" ondragstart='dragstart(event)' draggable='true'>\
             <div><h3>Title: " + todo[i].title + "</h3>\
             <h4>Description: " + todo[i].description + "</h4>\
             <h4> Date:" + todo[i].date + "</h4>\
             </div>\
             <button class='update btn btn-warning'> update</button>\
             <button class='details btn btn-success'> details</button>\
             <button class='del btn btn-danger glyphicon glyphicon-trash' ></button>\
             </div>";


                if (todo[i].status == "completed") {
                    $('.complete').css("display", "inline-block");
                    $('.notcomplete').css("display", "inline-block");
                    $('form').hide();
                    $('.add').show();
                     $('.addit').show();
                    $('.details').show();
                    $('.complete').append(data).animate({'margin-top':10});
                    $('#logout').show();

                } else

                {
                    $('.complete').css("display", "inline-block");
                    $('.notcomplete').css("display", "inline-block");
                    $('form').hide();
                    $('.notcomplete').append(data2).animate({'margin-top':10});
                    $('#logout').show();
                    $('.add').show();
                    $('.addit').show();


                }

            }
//****************************delete from todo with confirm ***************************************************
            $('body').on('click', '.del', function() {
              var r = confirm("Are yOu sure!");
              // r.css({"background-color": "yellow"});
                  if (r == true) {

                      $(this).parent().remove();
                      console.log('del 1');
                      user.deleteList($(this).parent().attr("id"));
                  }
                   else {
                     $('.complete').show();
                     $('.notcomplete').show();
                     $('.addit').show();
                     $('.detailss').hide();
                     $('#logout').show();

                  }

            });
//******************************************************************************************
//****************************details of todo item ****************************************
            $('body').on('click', '.details', function() {

                user.details($(this).parent().attr("id"));
            });

//******************************************************************************************



$('body').on('click','.update',function(){

    $(".updateform").show();
    user.searchList($(this).parent().attr("id")).then(function(res){

          // console.log(res.data);
          var item=res.data[0];
          $('.updateform input').each(function()
{

    $(this).attr('value',item[$(this).attr('name')])


})


          });

    $(this).parent().remove();
  user.deleteList($(this).parent().attr("id"));


  });
  }//end of renser
    }; // end object

//*********************************************************************************************
    $(document).ready(function() {

    //*******login form *******
    $("form").submit(function(e) {
        e.preventDefault();
        var formData = $("form").serializeArray();
        console.log(formData);
        var userData = {};
        for (var i = 0; i < formData.length; i++) {
            userData[formData[i].name] = formData[i].value
        }
        user.search(userData.email, userData.pass).then(function(result) {
                if (result.staus == "error") {
                    console.log(result.data);

                } else {
                    console.log(result.data);

                }
                console.log(result.data);

            },
            function(err) {
                console.log(err);

            }
        );
    });

//********updateform**************

$('.updateform').submit(function(e) {
    console.log("inside add form");

    e.preventDefault();
    var formData = $('.updateform').serializeArray();
    console.log(formData);
    var list = {}
    for (var i = 0; i < formData.length; i++) {
        list[formData[i].name] = formData[i].value;
    }
    console.log("before insert");
    var title = list.title;
    var description = list.description;
    var user_id2=localStorage.getItem('user_id');
  var user_id =parseInt(user_id2);
    console.log(user_id);
    var status = list.status;

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    var curr_hour=d.getHours() ;
    var curr_min=d.getMinutes();
var date=curr_date+"-"+curr_month+"-"+ curr_year+" "+curr_hour+":"+curr_min;
    user.insertList(title, description, status, user_id, date);
    $('.updateform').hide();

});

    //******logout from app ************
    $("#logout").on('click', function(e) {
        e.preventDefault();
        $('form').each(function() {
            this.reset();
        });
        $('form').show();
        location.reload();
        $('.complete').hide();
        $('.notcomplete').hide();
        $('.addit').hide();
    });
    //********* add item to todo list***********

    $('body').on('click', '.addit', function() {
        $(".popUp").slideDown();
        $('.addform').show();
        console.log("click add");
    })

    //************* add item form*****************
    $('.addform').submit(function(e) {
        console.log("inside add form");

        e.preventDefault();
        var formData = $('.addform').serializeArray();
        console.log(formData);
        var list = {}
        for (var i = 0; i < formData.length; i++) {
            list[formData[i].name] = formData[i].value;
        }
        console.log("before insert");
        var title = list.title;
        var description = list.description;
        var user_id2=localStorage.getItem('user_id');
      var user_id =parseInt(user_id2);
        console.log(user_id);
        var status = list.status;
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        var curr_hour=d.getHours() ;
        var curr_min=d.getMinutes();
var date=curr_date+"-"+curr_month+"-"+ curr_year+" "+curr_hour+":"+curr_min;
        var email = list.email;
        var pass = list.pass;
        user.insertList(title, description, status, user_id, date);
        $('.addform').hide();
        $('.popUp').hide();

    });
      //************************************************************************************************

}); // end document.read()

//*************************************************************************************************
//************************************************************************************************


 //user.createTableUser();
 //user.createTableMylist();
 //user.insertUser({"name":"esraa","email":"esraa@yahoo.com","pass":"123"});
 //user.insertUser({"name":"eslam","email":"eslam@yahoo.com","pass":"123"});
 //user.insertList("item2","this is item2","completed",1,"5-3-2017 22:13");
//user.insertList("item33","this is item33","notcompleted",2,"5-3-2017 10:13");
 //user.insertList("item55","this is item55","completed",2,"5-4-2017 22:13");
