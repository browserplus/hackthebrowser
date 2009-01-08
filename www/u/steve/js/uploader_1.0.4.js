// create YAHOO object if required
if (typeof BPTool == "undefined" || !BPTool) {
    var BPTool = {};
}

// handle multiple inclusions of this file
BPTool.Uploader = typeof BPTool.Uploader != "undefined" && BPTool.Uploader ? BPTool.Uploader : function() {
    // "class" variables & functions
    var dropZoneNumber = 1;
    var doingUpload = false;
    var ACTION = {UPLOAD: "uploaded", ADD: "add", REMOVE: "remove", SELECT: "select", UNSELECT: "unselect"};

    var uploadTmpl = 
    '<div style="position:relative; width:100%; height:100%; padding:0; background:{uploadBackground}; font:{uploadFont}">' +
    '    <div style="color:{titleColor};">' + 
    '        <div style="position:absolute; top:10px; left:32px;">{fileLabel}</div>' +
    '        <div style="position:absolute; top:10px; right:110px;">{sizeLabel}</div>' +
    '        <div style="position:absolute; top:10px; right:24px;">{removeLabel}</div>' +
    '    </div>' +
    '    <div id="{dzid}" style="position:absolute; top:24px; left:16px; {filesWidth}; {filesHeight}; border:{fileBorder}; background:{fileBackground}; overflow-y:auto;overflow-x:hidden;">' +
    '        {files}' +
    '    </div>' +
    '    <div style="position:absolute; bottom:16px; left:16px; {filesWidth}; height:29px; border:{footerBorder}; color:{footerColor}; background:{footerBackground}; font:{footerFont};">' +
    '        <div style="position:absolute; bottom:7px; left:10px; width:200px;">{numfiles}</div>' +
    '        <div style="position:absolute; bottom:7px; left:64px; width:200px; "><a id="{browseButton}" style="color:{footerColor};" href="#">{browseLabel}</a></div>' +
    '        <div style="position:absolute; bottom:7px; right:80px;">{totalLabel}: {total}</div>' +
    '        <div style="position:absolute; bottom:7px; right:5px; visibility:{vupload};"><a id="{uploadButton}" style="color:{footerColor};" href="#">{uploadLabel}</a></div>' +
    '    </div>' +
    '</div>';

    var fileTmpl = 
        '<div id="{dzid}_file{index}" style="position:relative; width:100%; height:20px; color:{fileColor};cursor:default;">' +
        '   <div id="{dzid}_prog{index}" style="position:absolute; width: 0%; height:20px; background:#ccc;"></div>' + 
        '   <div style="position:absolute; top:5px; left: 10px;">{fname}</div>' +
        '   <div style="position:absolute; top:5px; right:80px;">{fsize}</div>' +
        '   <div title="{trashLabel}" class="{dzid}_remove" style="position:absolute; top:7px; right:22px; width:10px; height:10px;background:transparent url(http://l.yimg.com/g/images/upload/trash_can.gif) no-repeat; margin-left:15px; text-decoration:none;"></div>' + 
        '</div>';

    var upsellTmpl =
        '<div style="width:100%; height:100%; padding:0; background:#f7f7f7; font-size:10pt; font-family:Tahoma,Verdana,Arial,Sans-Serif;">' +
        '    <div style="padding:20px;">' +
        '        To use the advanced uploader you must first install Yahoo BrowserPlus&trade;. ' +
        '        <a target="_blank" href="{url}">Click here</a> to install BrowserPlus.  ' + 
        '        Installation will take just a few minutes and not require a browser restart.' + 
        '    </div>' +
        '</div>';

    var progressTmpl = 
        '<div style="position:relative; width:100%; height:100%; padding:0; background:#f7f7f7; font-family:Arial,Sans-Serif;"">' +
        '    <div style="position:absolute; top:16px; left:16px; bottom:16px; right:16px; background:#fff; border:1px solid #ccc;">' + 
        '        <div style="position:relative; top:15px; left:20px; font-size:11pt; font-weight:bold; ">Loading Advanced Uploader...</div>' +
        '        <div style="position:absolute; top:35px; right:20px; left:20px; height:17px; border:1px solid #e4e4e4;width:200px;">' +
        '           <div style="width:{percentage}%; height:17px; background:#666;"></div>' + 
        '        </div>' +
        '    </div>' +
        '</div>';

    var errorTmpl = 
        '<div style="position:relative; width:100%; height:100%; background:#f7f7f7; font-size:10pt; font-family:Tahoma,Verdana,Arial,Sans-Serif;">' +
        '    <div style="padding:20px;">' +
        '        <div style="font-weight:bold; padding:0 0 16px 0">Error loading Yahoo! BrowserPlus&trade;</div>' +
        '        <div style="padding:0 0 10px 0;">Please report this error to the website administrator:</div>' +
        '        <div style="padding:8px; background:#ddd; font-family:monospace;font-size:9pt;">{error}</div>' +
        '    </div>' +
        '</div>';


    function getUniqueDropzoneId() {
        return "ybpt_uploader_dz_" + dropZoneNumber++;
    }

    function substitute(s, o) {
        var i, j, k, key, v, meta, saved=[], token, SPACE=' ', LBRACE='{', RBRACE='}';

        for (;;) {
            i = s.lastIndexOf(LBRACE);
            if (i < 0) { break;}
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) { break; }

            //Extract key and meta info 
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }

            // lookup the value
            v = o[key];
            s = s.substring(0, i) + v + s.substring(j + 1);
        }

        // restore saved {block}s
        for (i=saved.length-1; i>=0; i=i-1) {
            s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
        }

        return s;
    }

    function isArray(o) { 
        if (o) {
           return  (typeof o.length === 'number' && isFinite(o.length) && typeof o.splice === 'function');
        }
        return false;
    }

    function isObject(o) {
        return (o && (typeof o === 'object' || typeof o === 'function')) || false;
    }

    function arrayToMap(arr)
    {
        var i, map = {};
        for (i = 0; i < arr.length; i++) {
            map[arr[i]] = 1;
        }
        
        return map;
    }
    
    function mergeMap(orig, newvals)
    {
        var key;
        
        if (newvals) {
            for (key in newvals) {
                if (newvals.hasOwnProperty(key) && orig.hasOwnProperty(key)) {
                    orig[key] = newvals[key];
                }
            }
        }
        
        return orig;
    }

    return {
        create: function(containingDiv, initParams) {
            var userDiv = containingDiv;
            var MimeTypes = null;
            var ConfigParams = {
                fileCB: null,
                postCB: null,
                uploadUrl: null,
                fileVarName: "file",
                mimeTypes: null,

                // UI
                uploadBackground: "#f7f7f7",
                uploadFont: "8pt tahoma,sans-serif",
                titleColor: "#666",
                fileLabel: "File",
                sizeLabel: "Size",
                removeLabel: "Remove?",
                trashLabel: "Remove file from list",
                fileBorder: "1px solid #ccc",
                fileBackground: "#fff",
                fileColor: "#666",
                selectBackground: "#006adb",
                selectColor: "#fff",
                browseLabel: "Browse...",
                uploadLabel: "Upload",
                hoverBackground: "#ffd",
                progressBackground: "#ccc",
                progressBorderColor: "#f08",
                footerBackground: "#eee",
                footerFont: "bold 8pt tahoma,sans-serif",
                footerBorder: "1px solid #ccc",
                footerColor:"#000",
                fileLabel: "File",
                filesLabel: "Files",
                totalLabel: "Total"
            };

            if (typeof containingDiv != 'string') {
                throw "BPTool.Uploader.create() requires a string argument" +
                " which is the id of a div into which an advanced " +
                "uploader is rendered.";
            }

            ConfigParams = mergeMap(ConfigParams, initParams);
            if (isArray(ConfigParams.mimeTypes) && ConfigParams.mimeTypes.length > 0) {
                MimeTypes = arrayToMap(ConfigParams.mimeTypes);
            }

            return function() {
                // private instance variables
                var dropZoneId = getUniqueDropzoneId();
                var browseButton = dropZoneId + "browse";
                var uploadButton = dropZoneId + "upload";
                var droppedFiles = [];
                var selectedFileId = null;

                function bytesToString(size)
                {
                    var i, units = [' B',' KB',' MB', ' GB',' TB'];
                    for (i = 0; size > 1024; i++) { size /= 1024; }
                    return Math.round(size*10)/10 + units[i];
                }

                function getUUID(file)
                {
                    return dropZoneId+"_"+file.BrowserPlusHandleID;
                }
                
                function callback(file, action, value)
                {
                    if (ConfigParams.fileCB) {
                        ConfigParams.fileCB({
                            success: true,
                            action: action,
                            name: file.name,
                            size: file.size,
                            id: userDiv,
                            uuid: getUUID(file),
                            value: value
                        });
                    }
                }

                function repaint()
                {
                    var el = document.getElementById(dropZoneId);
                    var x = document.createTextNode(".");
                    el.appendChild(x);
                    el.removeChild(x);                    
                }

                function renderUpsellUI(installUrl) {
                    var c = document.getElementById(containingDiv);        
                    if (!c) { throw("No such id: '" + containingDiv + '"'); }
                    
                    c.innerHTML = substitute(upsellTmpl, {url: installUrl});
                }

                function renderErrorUI(errorString) {
                    var c = document.getElementById(containingDiv);        
                    if (!c) { throw("No such id: '" + containingDiv + '"'); }
                    
                    c.innerHTML = substitute(errorTmpl, {error: errorString});
                }

                function renderProgressUI(x) {
                    var c = document.getElementById(containingDiv);        
                    if (!c) { throw("No such id: '" + containingDiv + '"'); }
                    
                    c.innerHTML = substitute(progressTmpl, {percentage: x.totalPercentage});
                }

                function highlightFile(id, sel) {
                    var el = document.getElementById(id);
                    if (sel) {
                        el.className = dropZoneId + "_selected";
                        el.style.backgroundColor = ConfigParams.selectBackground;
                        el.style.color = ConfigParams.selectColor;
                    } else {
                        el.className = "";
                        el.style.backgroundColor = "";
                        el.style.color = ConfigParams.fileColor;
                    }
                }

                function onFileSelect(files) {
                    for (var i = 0; i < files.length; i++) {
                        if ( (!MimeTypes || MimeTypes[files[i].mimeType] === 1) && files[i].mimeType != "application/x-folder") {
                            callback(files[i], ACTION.ADD);
                            droppedFiles.push(files[i]);
                        }
                    }
                    renderCoreUI();
                }

                function onZoneHover(b) {
                    var el = document.getElementById(dropZoneId);
                    el.style.background = b ? ConfigParams.hoverBackground : ConfigParams.fileBackground;
                    repaint();
                }

                function dropZoneClickEvent(e) {
                    var el, a, re, p;
                    if (!doingUpload) { 
                        e = e || window.event;
                        el = e.target || e.srcElement;
                        if (el && 3 == el.nodeType) {// defeat Safari bug
                            el = el.parentNode;
                        }


                        if (el.className == (dropZoneId + "_remove")) {
                            // remove a file from the list
                            a = el.parentNode.id.match(/[0-9]+$/);
                            if (a[0]) {

                                if (selectedFileId) {
                                    // unselect the selected file
                                    callback(droppedFiles[selectedFileId.match(/[0-9]+$/)[0]], ACTION.UNSELECT);
                                    selectedFileId = null;
                                }

                                // remove the file from the list
                                callback(droppedFiles[a[0]], ACTION.REMOVE);
                                droppedFiles.splice(a[0], 1);
                                renderCoreUI();
                            }
                        } else {
                            re = new RegExp(dropZoneId + "_file[0-9]+");
                            p = null;
                            
                            // mouse clicked in dropZoneArea, get the row that was clicked on
                            if (re.test(el.id)) {
                                p = el;
                            } else if (re.test(el.parentNode.id)) {
                                p = el.parentNode;
                            }

                            if(p) {
                                // handle selecting/unselecting file
                                if (selectedFileId) {
                                    highlightFile(selectedFileId, false);
                                    callback(droppedFiles[selectedFileId.match(/[0-9]+$/)[0]], ACTION.UNSELECT);
                                    
                                    if (p.id != selectedFileId) {
                                        highlightFile(p.id, true);
                                        selectedFileId = p.id;
                                        callback(droppedFiles[selectedFileId.match(/[0-9]+$/)[0]], ACTION.SELECT);
                                    } else {
                                        selectedFileId = null;
                                    }
                                } else {
                                    highlightFile(p.id, true);
                                    selectedFileId = p.id;
                                    callback(droppedFiles[selectedFileId.match(/[0-9]+$/)[0]], ACTION.SELECT);
                                }
                            } else if (selectedFileId) {
                                highlightFile(selectedFileId, false);
                                callback(droppedFiles[selectedFileId.match(/[0-9]+$/)[0]], ACTION.UNSELECT);
                                selectedFileId = null;
                            }
                        }
                    }
                }
                
                function browseButtonClickEvent(e) {
                    var browserArgs = ConfigParams.mimeTypes ? {mimeTypes: ConfigParams.mimeTypes} : {};
                    BrowserPlus.FileBrowse.OpenBrowseDialog(browserArgs, function(res) {
                        if (res.success) {
                            onFileSelect(res.value); 
                        }
                    });
                    return false;
                }

                function uploadButtonClickEvent(e) {
                    if (ConfigParams.uploadUrl) {
                        if (selectedFileId) {
                            highlightFile(selectedFileId, false);
                            callback(droppedFiles[selectedFileId.match(/[0-9]+$/)[0]], ACTION.UNSELECT);
                            selectedFileId = null;
                        }
                        startUpload();
                        if (document.getElementById(uploadButton)) {  // IE6 deletes this element for no apparent reason
                            document.getElementById(uploadButton).style.visibility = "hidden";
                        }

                        return false;
                    }
                }

                function renderCoreUI() {
                    var i, files = "", sizeInBytes, totalInBytes = 0, filesWidth, filesHeight, container, subVars, key;

                    container = document.getElementById(containingDiv);

                    filesHeight = container.offsetHeight ? ("height:" + (container.offsetHeight - 72) + "px") : "bottom:48px";
                    filesWidth  = container.offsetWidth  ? ("width:" + (container.offsetWidth - 32) + "px") : "right:16px";

                    for (i = 0; i < droppedFiles.length; i++) {
                        sizeInBytes = "";
                        if (droppedFiles[i].size) {
                            sizeInBytes = bytesToString(droppedFiles[i].size);
                            totalInBytes += droppedFiles[i].size;
                        }

                        files += substitute(fileTmpl, {
                            index: i, 
                            fname: droppedFiles[i].BrowserPlusHandleName,
                            fsize: sizeInBytes, 
                            dzid: dropZoneId,
                            trashLabel: ConfigParams.trashLabel,

                            // customizable props
                            fileColor: ConfigParams.fileColor
                        });
                    }
                     
                    subVars = {
                        filesHeight: filesHeight,
                        filesWidth: filesWidth,
                        dzid: dropZoneId,
                        browseButton: browseButton,
                        uploadButton: uploadButton,
                        numfiles: droppedFiles.length + " " + (droppedFiles.length === 1 ? ConfigParams.fileLabel : ConfigParams.filesLabel),
                        total: bytesToString(totalInBytes),
                        vupload: (droppedFiles.length > 0 && !doingUpload ? "visible" : "hidden"),
                        files: files
                    };

                    for (key in ConfigParams) {
                        if (ConfigParams.hasOwnProperty(key)) {
                            subVars[key] = ConfigParams[key];
                        }
                    }
                      
                    container.innerHTML = substitute(uploadTmpl, subVars);

                    
                    // set up drag and drop on this dropzone
                    BrowserPlus.DragAndDrop.RemoveDropTarget(
                        { id: dropZoneId },
                        function () {
                            BrowserPlus.DragAndDrop.AddDropTarget(
                                { id: dropZoneId },
                                function (rez) {
                                    if (rez.success) {
                                        BrowserPlus.DragAndDrop.AttachCallbacks(
                                            {id: dropZoneId, hover: onZoneHover, drop: onFileSelect}, 
                                            function() {});
                                    }
                                }
                            );
                        });

                    document.getElementById(dropZoneId).onclick   = dropZoneClickEvent;
                    document.getElementById(browseButton).onclick = browseButtonClickEvent;
                    document.getElementById(uploadButton).onclick = uploadButtonClickEvent;
                    if (selectedFileId) {
                        highlightFile(selectedFileId, true);
                    }
                }

                function startUpload() {
                    var i, s="", pDiv = document.getElementById(dropZoneId + "_prog0");
                    if (droppedFiles.length === 0) {
                        doingUpload = false;
                        return false;
                    }

                    doingUpload = true;

                    pDiv.style.borderRight = "2px solid " + ConfigParams.progressBorderColor;
                    pDiv.style.background = ConfigParams.progressBackground;

                    function updateProgress(x) {
                        pDiv.style.width = Math.min(x.filePercent, 100) + "%";
                        repaint();
                    }

                    function uploadComplete(res) {
                        if (res.success) {
                            var file = droppedFiles[0];
                            droppedFiles.shift();
                            renderCoreUI();
                            // result.value has elements statusCode, statusString, headers, and body
                            callback(file, ACTION.UPLOAD, res.value);
                            startUpload();
                        } else if (ConfigParams.fileCB) {
                            ConfigParams.fileCB({success: false, error: res.error, verboseError: res.verboseError, id: userDiv});
                            doingUpload = false;
                            renderCoreUI();
                        }
                    }

                    var uploadObj, filesObj = {}, postObj = {};

                    filesObj[ConfigParams.fileVarName] = droppedFiles[0];

                    uploadObj = {
                        url: ConfigParams.uploadUrl,
                        progressCallback: updateProgress,
                        files: filesObj,
                        cookies: document.cookie
                    };
                    
                    if (ConfigParams.postCB) {
                        postObj = ConfigParams.postCB(getUUID(droppedFiles[0]));
                        if (isObject(postObj)) {
                            uploadObj.postvars = postObj;
                        }
                    }

                    BrowserPlus.Uploader.upload(uploadObj, uploadComplete);
                    return false;
                }

                return {
                    render: function() {
                        BrowserPlus.init({},function(res) {
                            if (res.success) {
                                BrowserPlus.require(
                                    {
                                        services: 
                                        [
                                            { service: "Uploader", version: "3" },
                                            { service: "DragAndDrop", version: "1" },
                                            { service: "FileBrowse", version: "1" }
                                        ],
                                        progressCallback: renderProgressUI
                                    }, 
                                    function(res) {
                                        if (res.success) {
                                            renderCoreUI();
                                        } else {
                                            var err = res.verboseError ? res.verboseError : res.error;
                                            renderErrorUI("problem loading services: " + err);
                                        }
                                    }
                                );
                            } else if (res.error === "bp.notInstalled") {
                                renderUpsellUI("http://browserplus.yahoo.com/install");   
                            }
                        }
                    );
                }
            };
        }();
    }
};}();