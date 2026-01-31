// this code shows each trial and participants' answer to that separately. In order to run this code you need to change the name of the 
// folder 'data' to 'raw2' in the same folder as the code it. 

const fs = require('fs');
var XLSX = require('xlsx');
var excel = require('excel4node');
var seqs = [];
function compareSeq(seq1, seq2) {
    if (seq1[0].length == 1) {
        var s1Corr, s2Corr, s1False, s2False;
        if (typeof seq1[0] !== 'string') {
            seq1 = seq1.map(s => `[${s.join()}]`)
        }
        if (typeof seq2[0] !== 'string') {
            seq2 = seq2.map(s => `[${s.join()}]`)
        }
        if (seq1[0] !== seq1[1] && seq1[0] !== seq1[2]) {
            s1Corr = seq1[0];
            s1False = seq1[1];
        } else if (seq1[1] !== seq1[0] && seq1[1] !== seq1[2]) {
            s1Corr = seq1[1];
            s1False = seq1[0];
        } else {
            s1Corr = seq1[2];
            s1False = seq1[0];
        }
        if (seq2[0] !== seq2[1] && seq2[0] !== seq2[2]) {
            s2Corr = seq2[0];
            s2False = seq2[1];
        } else if (seq2[1] !== seq2[0] && seq2[1] !== seq2[2]) {
            s2Corr = seq2[1];
            s2False = seq2[0];
        } else {
            s2Corr = seq2[2];
            s2False = seq2[0];
        }
        if (s1Corr === s2Corr && s2False === s1False) {
            return true;
        } else {
            return false;
        }
    } else {
        var s1Corr, s2Corr;
        if (typeof seq1[0] !== 'string') {
            seq1 = seq1.map(s => `[${s.join()}]`)
        }
        if (typeof seq2[0] !== 'string') {
            seq2 = seq2.map(s => `[${s.join()}]`)
        }
        if (seq1[0] !== seq1[1] && seq1[0] !== seq1[2]) {
            s1Corr = seq1[0];
        } else if (seq1[1] !== seq1[0] && seq1[1] !== seq1[2]) {
            s1Corr = seq1[1];
        } else {
            s1Corr = seq1[2];
        }
        if (seq2[0] !== seq2[1] && seq2[0] !== seq2[2]) {
            s2Corr = seq2[0];
        } else if (seq2[1] !== seq2[0] && seq2[1] !== seq2[2]) {
            s2Corr = seq2[1];
        } else {
            s2Corr = seq2[2];
        }
        s1Corr = s1Corr.replaceAll(' ', "");
        s2Corr = s2Corr.replaceAll(' ', "");
        if (s1Corr === s2Corr) {
            return true;
        } else {
            return false;
        }
    }
}
function formatSeq(seq) {
    if (typeof seq[0] !== 'string') {
        seq = seq.map(s => `[${s.join()}]`)
    }
    seq = seq.map(s => s.replaceAll(" ", ""));
    return seq;
}
function processJson(fileName) {
    var file = require(`./raw2/${fileName}`); 
    Object.keys(file).forEach(k => {
        file[k].data.forEach(fk => {
            seqs.push({ mod: k, seq: fk.seq })
        })
    })
}
(() => {
    fs.readdir('./raw2', (err, files) => {
        processJson(files[0]);
        var workbook = new excel.Workbook();
        var worksheet = workbook.addWorksheet('Sheet 1');
        worksheet.cell(1, 1).string(`Participant`);
        worksheet.cell(1, 2).string(`OverallAR`);
        worksheet.cell(1, 3).string(`OverallAI`);
        worksheet.cell(1, 4).string(`OverallAS`);
        worksheet.cell(1, 5).string(`OverallVR`);
        worksheet.cell(1, 6).string(`OverallVI`);
        worksheet.cell(1, 7).string(`OverallVS`);
        worksheet.cell(1, 8).string(`TactReg`);
        worksheet.cell(1, 9).string(`TactIrreg`);
        worksheet.cell(1, 10).string(`TactSD`);
        seqs.forEach((s, index) => {
            var mod = s.mod;
            var seq = formatSeq(s.seq);
            worksheet.cell(1, index + 11).string(`${mod}\n${seq}`);
            var x = 2;
            files.forEach(fileName => {
                //console.log(`${fileName} => ${x}`);
                var found = false;
                var ScoreSet = false;
                if (fileName.endsWith('json')) {
                    var file = require(`./raw2/${fileName}`);
                    var participantNumber = fileName.split("Processed Preprocessedpilot")[1].split(".json")[0];
                    if (!ScoreSet) {
                        if (mod === "VisReg") {
                            worksheet.cell(x, 5).number(file[mod].Score);
                        }
                        if (mod === "VisIrreg") {
                            worksheet.cell(x, 6).number(file[mod].Score);
                        }
                        if (mod === "VisSD") {
                            worksheet.cell(x, 7).number(file[mod].Score);
                        }
                        if (mod === "AudIrreg") {
                            worksheet.cell(x, 3).number(file[mod].Score);
                        }
                        if (mod === "AudReg") {
                            worksheet.cell(x, 2).number(file[mod].Score);
                        }
                        if (mod === "AudSd") {
                            worksheet.cell(x, 4).number(file[mod].Score);
                        }
                        if (mod === "TactReg") {
                            worksheet.cell(x, 8).number(file[mod].Score);
                        }
                        if (mod === "TactIrreg") {
                            worksheet.cell(x, 9).number(file[mod].Score);
                        }
                        if (mod === "TactSD") {
                            worksheet.cell(x, 10).number(file[mod].Score);
                        }
                        worksheet.cell(x, 1).number(parseInt(participantNumber));
                        ScoreSet = true;
                    }
                    file[mod].data.forEach(fs => {
                        if (!found) {
                            if (compareSeq(fs.seq, seq)) {
                                found = true;
                                worksheet.cell(x, index + 11).number(fs.userAnswer == fs.correctAnswer ? 1 : 0);
                            }
                        }
                    })
                }
                x++;
            });
        });
        workbook.write("./Trials_separate.xlsx");
    });
})();
