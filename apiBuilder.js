var fs = require('fs');
var colors = require('colors');
var exec = require('child_process').exec;
var rimraf = require('rimraf');
var jsonfile = require('jsonfile');
var detect = require('language-detect');

// module.exports = function () {
var apiDir = process.cwd() + '/_api';

if (!fs.existsSync(apiDir))
    fs.mkdirSync(apiDir);

var adsnRepoDir = process.cwd() + '/Algo_Ds_Notes';

// if (fs.existsSync(adsnRepoDir)) {
//     // removes old cloned repo
//     rimraf.sync(adsnRepoDir);
//     console.log("🍔 Deleted old Repo".yellow)
// }

// clone_adns_repo();

// deleting git repo from cloned repository
rimraf.sync(adsnRepoDir + '/.git');

var algoNames = dirs(process.cwd() + '/Algo_Ds_Notes')
// console.log(algoNames);


// Api for algo list
var algoList = {
    availabe_algo: algoNames,
    size: algoNames.length
};
var mainAPI_Dir = process.cwd() + '/_api/algoList.json';
jsonfile.writeFile(mainAPI_Dir, algoList, { spaces: 2 }, function (err) {
    console.error(err)
})



algoNames.forEach(function (algo) {

    var algoDir = adsnRepoDir + '/' + algo;

    // Reades files dir
    var algoData = {};
    var algoList = [];
    var langList = [];
    fs.readdirSync(algoDir).forEach(file => {
        if (!file.includes(".md")) {

            var lang = detect.sync(algoDir + '/' + file)
            if (lang != undefined) {
                var algoContent ={};
                algoList.push(file);
                if (lang === "Smalltalk")
                    langList.push("C#");

                else
                    langList.push(lang);

                var mainAPI_Dir = process.cwd() + '/_api/algoLang/' + algo+"-"+lang+ '.json';
                algoContent["mainALGO"] = fs.readFileSync(algoDir + '/' + file).toString();
                jsonfile.writeFile(mainAPI_Dir, algoContent, { spaces: 2 }, function (err) {
                    console.error(err)
                })

            }

        }
    });

    // console.log(algoList);

    algoData['filenames'] = algoList;
    algoData['langauges'] = langList;
    algoData['no_of_files'] = langList.length;

    var mainAPI_Dir = process.cwd() + '/_api/algos/' + algo + '.json';
    jsonfile.writeFile(mainAPI_Dir, algoData, { spaces: 2 }, function (err) {
        console.error(err)
    })


});







// functions
function clone_adns_repo() {
    exec('git clone https://github.com/algobook/Algo_Ds_Notes.git', (err, stdout, stderr) => {
        if (err) {
            console.error(err); console.log("cloned");
        } else {
            console.log("cloned🎉🎉🎉🎉🎉".green);
        }
    });
}
/**
 * returns dirs in path
 */
function dirs(p) {
    return fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory())
}
// }