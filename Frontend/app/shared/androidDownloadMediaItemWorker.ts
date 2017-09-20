require("globals"); // necessary to bootstrap tns modules on the new thread
declare var java:any;

(<any>global).onmessage = function(msg){
    var request = msg.data;
    var url: string = request.url;
    var destination: string = request.destination;

    saveMediaItem(url, destination);
    (<any>global).close();
}

function saveMediaItem(url: string, destinationPath: string) {
    console.log("Saving ", url, "to ", destinationPath);
    let javaUrl = new java.net.URL(url);
    let javaFile = new java.io.File(destinationPath);
    let inStream = new java.io.BufferedInputStream(javaUrl.openStream());
    let outStream = new java.io.FileOutputStream(javaFile);
    let buffer = new (<any>Array).create("byte", 4096);
    let n = 0;
    console.log("Downloading ", url, "...");
    try{
        while (-1 != (n = inStream.read(buffer)))
        {
            outStream.write(buffer, 0, n);
        }
    }
    catch(ex) {
        console.log("Failed downloading ", url, " Error: ", JSON.stringify(ex));
        (<any>global).postMessage({success: false});
    }
    finally{
        if (inStream){
            inStream.close();
        }
        if (outStream){
            outStream.close();
        }
    }
    console.log("Finished downloading ", url, "!");
    (<any>global).postMessage({success:true});
}