var ID = '';

function deleleIssue(){   
    console.log("I am in delete")                   
    document.getElementById('btn-delete-issue').onclick = () => {
      console.log(this.id)
       axios.delete('/api/issues/' + this.id).then(
                    res => {
                      document.getElementById('issues').
                       removeChild(document.getElementById(this.id));; 
                         console.log(res.data)
                    }
               ).catch( err => console.log(err))
               
   }
}

function  updateIssue(data,issue_id){
  console.log(data)
   addIssue(data,issue_id,'btn-edit-issue');  
 
}

function addIssue(data,project_id,id){      
                
                  document.getElementById(id).onclick = () => {
                    // console.log(data[0].project)   
                    // let getUrl = window.location;
                    // let URL = getUrl.origin +  '/api/issues/manage/'  + data[0].project 
                           
                     
                      axios.get('/api/issues/manage/' + project_id)                  
                          .then(res => {   
                                // console.log(res.data) 
                              //  document.write(res.data);            
                                document.getElementById('project-issue').innerHTML = res.data;
                                ID = project_id;
                              // above line makes not to trigger action in the issue page on submit btn click 
                          }).
                          then(
                              () => {
                                if( id == 'btn-edit-issue'){
                                    
                                   setUpdateFields(data)
                                }else{
                                  document.getElementById('issue-form-wrapper').setAttribute("name",'new-issue');
                                }
                              }

                             
                          )
                         .catch( err => console.log( err ))
                  }
} 


function setUpdateFields(data){
  
  //  document.getElementById('issue_title').value ='';
   document.getElementById('issue_title').value = data.issue_title;
   document.getElementById('issue_text').value = data.issue_text;
   document.getElementById('assigned_to').value = data.assigned_to;
   document.getElementById('status_select').value = data.status_text;
   document.getElementById('open').checked = data.open;
   document.getElementById('issue-form-wrapper').setAttribute("name",'edit-issue');   
  
}



function sendissue(){
  
  let action = document.getElementById('issue-form-wrapper').getAttribute("name");

  console.log("sending an issue") 
  let issue_title = document.getElementById('issue_title').value;
  let issue_text = document.getElementById('issue_text').value;
  let assigned_to = document.getElementById('assigned_to').value;
  let status_text = document.getElementById('status_select').value;
  let open = getOpen();

  const Issue = {
      issue_title,
      issue_text,
      assigned_to,
      status_text,
      open
  };
  
  
  console.log("Value of open:" + Issue.open)
  let id = ID;
  console.log("id in addIssue"+ id)
  console.log("this is before calling")        
 
  if( action == 'new-issue'){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  const data = JSON.parse( this.responseText );
                  console.log(data)
                  const newIssueItem = document.createElement('li');
                  newIssueItem.id = data._id;
                  const newIssue = document.createTextNode(data.issue_title);  
                  newIssueItem.appendChild(newIssue);
                  document.getElementById('issues').appendChild(newIssueItem); 
                  // document.getElementById( newIssueItem.id ).addEventListener('click', deleleIssue); 
                  
            
            }
        };
        xhttp.open("POST", '/api/issues', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({ id: id , issue: Issue }));
        
  //       axios.post('/api/issues/' + id , Issue ,{
  //                 headers: {
  //                     'Authorization': localStorage.getItem('jwtToken')
  //                 }
  //                 }
                  
  //                 ).then(
  //             res => {
  //                 console.log( res.data )
  //                 //- localStorage.setItem('newIssue',res.data.issue_title);
  //                 //- list.appendChild(btn);    
  //                 const newIssueItem = document.createElement('li');
  //                 newIssueItem.id = res.data._id;
  //                 const newIssue = document.createTextNode(res.data.issue_title);  
  //                 newIssueItem.appendChild(newIssue);
  //                 document.getElementById('issues').appendChild(newIssueItem); 
  //                 document.getElementById( newIssueItem.id ).addEventListener('click',
  //                                                 deleleIssue); 
  //                 //- document.write(res.data)
                  
  //             }
  //         ).catch(
  //             err => console.log(err)
  //         )
  }

  if( action == 'edit-issue'){
   
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                  const data = JSON.parse( this.responseText );                 
                  document.getElementById( data._id ).innerHTML = data.issue_title;                     
            
            }
        };
        Issue.id = id;
        console.log(Issue)
        xhttp.open("PUT", '/api/issues', true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({issue: Issue }));
        
        // axios.put('/api/issues/'+ id,Issue, { headers: {
        //               'Authorization': localStorage.getItem('jwtToken')
        //           }
        //           })
        //       .then( 
        //           res =>{
        //               document.getElementById( res.data._id ).innerHTML = res.data.issue_title;
        //           })
        //       .catch( err => console.log( err  ))
       
        }
}

function clearForm(){
  document.getElementById('issue_title').value = '';
  document.getElementById('issue_text').value = '';
  document.getElementById('assigned_to').value = '';  
  document.getElementById('status_select').value = 'active';
  document.getElementById('open').checked = true;
}

function getOpen(){
  if( document.getElementById('open').checked ){
      return true;
  }
  return false;

}

function AjaxRequest(url, project_id ) {
  var xhttp = new XMLHttpRequest();
 
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      
        // console.log(JSON.parse(this.responseText)[0].issue_title)
        localStorage.setItem('project-issue',this.responseText)
        setIssueData(this.responseText, project_id)
               
     
        
      }
  };
  xhttp.open("GET", url, true);
  xhttp.send();

}

function  setIssueData(responseText, project_id ){
  document.getElementById('issues').innerHTML ='';
      // var arr = []
      var data = JSON.parse(responseText);
      data.forEach(element => {
        // arr.push({ id: element._id, issue_title: element.issue_title})
        let list = '';
        list = document.createElement('li');    
        list.id = element._id;                                                                                                                 
        let issue_title = document.createTextNode(element.issue_title);
        list.appendChild(issue_title);
        document.getElementById('issues').appendChild( list ); 
        document.getElementById(  list.id ).addEventListener('click',deleleIssue);
        document.getElementById(list.id).addEventListener('click',() => updateIssue(element,element._id));
      });
      issueManagementButtons(data,project_id);
}

function isRefresh(){
    try{
      setIssueData( localStorage.getItem('project-issue'))
    }catch(err){
      console.log(err)
    }
  
}


 function issueManagementButtons(data,project_id){
            document.getElementById('issue-btn-wrapper').innerHTML =''
            let addBtn = document.createElement("BUTTON");
            addBtn.id = "btn-create-issue";            
            addBtn.innerHTML = "create new issue";                                                                         
            document.getElementById('issue-btn-wrapper').appendChild( addBtn );  

        //    window.location.href = window.location.origin + '/api/issues/manage/' + data[0].project;
            // document.getElementById('btn-create-issue').
            //   addEventListener('click', AjaxRequest(window.location.origin + '/api/issues/manage/' + data[0].project));
            document.getElementById('btn-create-issue').addEventListener('click', addIssue(data,project_id,addBtn.id));
        
            let editBtn = document.createElement("BUTTON");
            editBtn.id = 'btn-edit-issue';
            editBtn.innerHTML = "Edit issue";                                                                         
            document.getElementById('issue-btn-wrapper').appendChild( editBtn);                     


            let deleteBtn = document.createElement("BUTTON");
            deleteBtn.id = 'btn-delete-issue';
            deleteBtn.innerHTML = "delete issue";                                                                         
            document.getElementById('issue-btn-wrapper').appendChild( deleteBtn );
            
           
}
