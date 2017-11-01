/* TODO
get mouse
*/

function tin_load(path, file){
	// path:  "usr/local/share/vim/doc/v-tips.txt"
	// file:  "v-tips.txt" 
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET",path + "/" + file, false);
	console.log("tin: " + path + "/" + file);
	xhttp.send();
	var res = xhttp.responseText;
	Module["FS_createDataFile"]( "/" + path, file, res, true, true);
}

function tin_load_doc(file){
	tin_load("usr/local/share/vim/doc", file);
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

// Include the baby 
document.write('<script type="text/javascript" src="vim.js" ></script>')

