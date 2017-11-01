/* TODO
get mouse
*/

function tin_load(path, file){
	// path:  "vim/doc"
	// file:  "v-tips.txt" 
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET",path + "/" + file, false);
	console.log("tin: " + path + "/" + file);
	xhttp.send();
	var res = xhttp.responseText;
	Module["FS_createDataFile"]( "/" + path, file, res, true, true);
}

function tin_load_doc(file){
	tin_load("vim/doc", file);
}

function tin_href(link){
    window.open(link, '<-vim.js');
}

function tin_download(file, content){
    var str = content;
    var str = str.replace(/<tincr>/g, "\n");
    var str = str.replace(/<tinq1>/g, "'");
    var str = str.replace(/<tinbs>/g, "\\");
    var str = encodeURIComponent(str);
    var str = "data:text/plain," + str;
    dl.href = str;
    dl.click();
}


var Module;
if(typeof Module==="undefined")Module=eval("(function() { try { return Module || {} } catch(e) { return {} } })()");
if(!Module.expectedDataFileDownloads){
	Module.expectedDataFileDownloads=0;
	Module.finishedDataFileDownloads=0}
Module.expectedDataFileDownloads++;


((function(){function runWithFS(){
	function assert(check,msg){
		if(!check)throw msg+(new Error).stack
	}

// Create path and symlink
Module["FS_createPath"]("/", "vim", true, true);
Module["FS_createPath"]("/","usr",true,true);
Module["FS_createPath"]("/usr","local",true,true);
Module["FS_createPath"]("/usr/local","share",true,true);
Module["FS_createLink"]("/usr/local/share", "vim", "/vim", true, true);


Module["FS_createPath"]("/vim","syntax",true,true);
Module["FS_createPath"]("/vim","colors",true,true);
Module["FS_createPath"]("/vim","doc",true,true);
Module["FS_createPath"]("/vim","vimfiles",true,true);
Module["FS_createPath"]("/vim/vimfiles","doc",true,true);
Module["FS_createPath"]("/vim","cheatsheet",true,true);
Module["FS_createPath"]("/vim/cheatsheet","doc",true,true);





// Yu heritage
tin_load("vim", "vimrc");
tin_load("vim/syntax","synload.vim");
tin_load("vim/syntax","syntax.vim");
tin_load("vim/syntax","javascript.vim");
tin_load("vim/syntax","nosyntax.vim");
tin_load("vim/syntax","vim.vim");
tin_load("vim/colors","Darkside.vim");

// Tin heritage
tin_load("vim", "first-page.txt");
tin_load("vim/cheatsheet/doc", "c-meta.txt");
tin_load("vim/syntax", "myhelp.vim");
tin_load("vim/syntax", "help.vim");
tin_load("vim/syntax", "sh.vim");
tin_load("vim/syntax", "python.vim");
// <-- Tinmarino 



// End from Yu
}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];
Module["preRun"].push(runWithFS)}}))();





// Include the baby 
document.write('<script type="text/javascript" src="vim.js" ></script>')
