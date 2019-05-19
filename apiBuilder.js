var fs = require('fs');
var colors = require('colors');
var exec = require('child_process').exec;
var rimraf = require('rimraf');
var jsonfile = require('jsonfile');
var detect = require('language-detect');

module.exports = function () {
    var apiDir = process.cwd() + '/_api';

    // Api director
    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir);
        fs.mkdirSync(apiDir + "/algoLang");
        fs.mkdirSync(apiDir + "/algos");
    }

    var adsnRepoDir = process.cwd() + '/Algo_Ds_Notes';
    const build = () => {

        var algoNames = dirs(process.cwd() + '/Algo_Ds_Notes');
        algoNames.shift();


        // Api for algo list
        var algoList = {
            availabe_algo: algoNames,
            size: algoNames.length
        };
        var mainAPI_Dir = process.cwd() + '/_api/algoList.json';
        jsonfile.writeFile(mainAPI_Dir, algoList, { spaces: 2 }, function (err) {
            // console.error(err)
        })

        var languages_list = [];


        algoNames.forEach(function (algo) {
            if (algo != ".git") {

                var algoDir = adsnRepoDir + '/' + algo;

                // Reades files dir
                var algoData = {};
                var algoList = [];
                var langList = [];
                fs.readdirSync(algoDir).forEach(file => {

                    if (fs.lstatSync(algoDir + '/' + file).isFile()) {
                        if (!file.includes(".md")) {
                            var lang = detect.sync(algoDir + '/' + file)
                            if (lang != undefined) {
                                var algoContent = {};
                                algoList.push(file);

                                if (lang === "Smalltalk") {
                                    langList.push("C#");
                                    var mainAPI_Dir = process.cwd() + '/_api/algoLang/' + algo + "-" + "C#" + '.json';
                                    languages_list.push("C#")
                                }
                                else {
                                    langList.push(lang);
                                    var mainAPI_Dir = process.cwd() + '/_api/algoLang/' + algo + "-" + lang + '.json';
                                    languages_list.push(lang)
                                }


                                algoContent["mainALGO"] = `${fs.readFileSync(algoDir + '/' + file,'utf-8').trim().toString()}`
                                jsonfile.writeFile(mainAPI_Dir, algoContent, { spaces: 2 }, function (err) {
                                    // console.error(err)
                                })

                            }

                        }
                    }
                });


                algoData['filenames'] = algoList;
                algoData['langauges'] = langList;
                algoData['no_of_files'] = langList.length;

                var mainAPI_Dir = process.cwd() + '/_api/algos/' + algo + '.json';
                jsonfile.writeFile(mainAPI_Dir, algoData, { spaces: 2 }, function (err) {
                    // console.error(err)
                });
                function onlyUnique(value, index, self) {
                    return self.indexOf(value) === index;
                }

                var langData = {
                    languages: languages_list.filter(onlyUnique)
                }

                var lang_api = process.cwd() + '/_api/langs.json';
                jsonfile.writeFile(lang_api, langData, { spaces: 2 }, function (err) {
                    // console.error(err)
                });


                console.log("[+]  ".green + "Completed ".cyan + algo.yellow);

            }
        });

    }

    if (fs.existsSync(adsnRepoDir)) {
        console.log("🍔 Thank you!".yellow)
        build()
    } else {
        clone_repo();
    }


  

    function clone_repo() {

        console.log("[+]  ".green + "Cloning Algo_ds_Notes ".cyan);
        exec('git clone https://github.com/algobook/Algo_Ds_Notes.git', (err, stdout, stderr) => {
            if (err) {
                console.error(err);
            } else {
                console.log("[+]  Cloned  🎉".green);
                build();
            }
        });
    }
    /**
     * returns dirs in path
     */
    function dirs(p) {
        return fs.readdirSync(p).filter(f => fs.statSync(p + "/" + f).isDirectory());
    }
}