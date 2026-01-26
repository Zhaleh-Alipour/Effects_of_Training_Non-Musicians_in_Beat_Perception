var XLSX = require('xlsx');
const fs = require('fs');
var excel = require('excel4node');
var finalExcel = [];
function processFile(fileName) { //all the process of finding correct answers, attention check failures etc. are done here
    var obj = XLSX.readFile(`../data/2_preprocessed_data/${fileName}`);
    var sheet = obj.Sheets[obj.SheetNames[0]];
    var Finalized = [];
    function formatFileName(file) { //it removes .xlsx from the end of file name
        return file.replace(/\.[^/.]+$/, "")
    }
    function parseRange(r) { // splits column name and row number, return an array, first element is column name, second is row number
        return r.split(/(\d+)/);
    }
    function parseVisReg(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0]; // k is the name of the column
                        }
                    }
                }
            });
            return ret;
        }
        function parseSeq(seq) {
            //console.log({seq}) in columns there are many repeated sequences
            final = [];
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }
            const size = seq.length / 3;
            while (seq.length > 0) {
                final.push(seq.splice(0, size).filter(unique)[0]);
            }
            //console.log({final}) duplicates are removed so we have just 3 sequences 
            return final;
        }
        function findIntervalDiff(seq) {
            console.log({ seq })
            if (seq[0].includes('6')) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq = seq.map(s => {
                return s.replace('[', '').replace(']', '').split(',').map(q => parseFloat(q));
            });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });

            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            console.log({ ret })
            return ret;
        }
        const seqColumn = detectColumn('VisReg');
        const userAnswerColumn = detectColumn('VisRegResp');
        const speedColumn = detectColumn('VisRegSpeed');
        const answerColumn = detectColumn('VisRegDiff');
        const colorColumn = detectColumn('VisRegColor');
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        var blocks = [];
        var tmp = [];
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v === "VisReg") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                sheet["AC1699"]
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        color: sheet[`${colorColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.color === "green") {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['VisReg'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 36).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };
    }
    function parseVisRegRot(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0]; // k is the name of the column
                        }
                    }
                }
            });
            return ret;
        }
        function parseSeq(seq) {
            //console.log({seq}) in columns there are many repeated sequences
            final = [];
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }
            const size = seq.length / 3;
            while (seq.length > 0) {
                final.push(seq.splice(0, size).filter(unique)[0]);
            }
            //console.log({final}) duplicates are removed so we have just 3 sequences 
            return final;
        }
        function findIntervalDiff(seq) {
            console.log({ seq })
            if (seq[0].includes('6')) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq = seq.map(s => {
                return s.replace('[', '').replace(']', '').split(',').map(q => parseFloat(q));
            });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });

            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            console.log({ ret })
            return ret;
        }
        const seqColumn = detectColumn('VisRegRot');
        const userAnswerColumn = detectColumn('VisRegRotResp');
        const speedColumn = detectColumn('VisRegRotSpeed');
        const answerColumn = detectColumn('VisRegRotDiff');
        const colorColumn = detectColumn('VisRegRotColor');
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        var blocks = [];
        var tmp = [];
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v === "VisRegRot") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                sheet["AC1699"]
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        color: sheet[`${colorColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.color === "green") {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['VisRegRot'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };
    }
    function parseVisIrreg(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function parseSeq(seq) {
            final = [];
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }
            const size = seq.length / 3;
            while (seq.length > 0) {
                final.push(seq.splice(0, size).filter(unique)[0]);
            }
            return final;
        }
        function findIntervalDiff(seq) {
            if (seq[0].includes('6')) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq = seq.map(s => {
                return s.replace('[', '').replace(']', '').split(',').map(q => parseFloat(q));
            });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return ret;
        }
        const seqColumn = detectColumn('VisIrreg');
        const userAnswerColumn = detectColumn('VisIrregResp');
        const speedColumn = detectColumn('VisIrregspeed');
        const answerColumn = detectColumn('VisIrregDiff');
        const colorColumn = detectColumn('VisIrregColor');
        var atCheckCorrectAnswers = 0;
        var blocks = [];
        var falseAlarms = 0;
        var tmp = [];
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "VisIrreg") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        color: sheet[`${colorColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.color === "green") {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['VisIrreg'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };
    }
    function parseVisIrregRot(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function parseSeq(seq) {
            final = [];
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }
            const size = seq.length / 3;
            while (seq.length > 0) {
                final.push(seq.splice(0, size).filter(unique)[0]);
            }
            return final;
        }
        function findIntervalDiff(seq) {
            if (seq[0].includes('6')) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq = seq.map(s => {
                return s.replace('[', '').replace(']', '').split(',').map(q => parseFloat(q));
            });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return ret;
        }
        const seqColumn = detectColumn('VisIrregRot');
        const userAnswerColumn = detectColumn('VisIrregRotResp');
        const speedColumn = detectColumn('VisIrregRotspeed');
        const answerColumn = detectColumn('VisIrregRotDiff');
        const colorColumn = detectColumn('VisIrregRotColor');
        var atCheckCorrectAnswers = 0;
        var blocks = [];
        var falseAlarms = 0;
        var tmp = [];
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "VisIrregRot") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        color: sheet[`${colorColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.color === "green") {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['VisIrregRot'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };
    }
    function parseVisSd(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function findIntervalDiff(seq) {
            if (seq[0].includes(6)) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return parseFloat(ret.toFixed(2));
        }
        function parseSeq(seq) {
            final = [];
            while (seq.length > 0) {
                final.push(seq.splice(0, 1));
            }
            return final;
        }
        const seqColumn = detectColumn('VisSD');
        const userAnswerColumn = detectColumn('VisSDresp');
        const speedColumn = detectColumn('VisSDspeed');
        const answerColumn = detectColumn('VisSDdiff');
        const colorColumn = detectColumn('VisSDcolor');
        var atCheckCorrectAnswers = 0;
        var easyTrialFails = 0;
        var blocks = [];
        var tmp = [];
        var falseAlarms = 0;
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "VisSD") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        color: sheet[`${colorColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.color === "green") {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.intervalDifference >= 2) {
                    easyTrialFails++;
                }
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['VisSD'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 42).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            easyTrialFails: easyTrialFails,
            falseAlarms
        };
    }
    function parseAudIrreg(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function getSeq(str) {
            str = str.split("IrregPatterns/")[1];
            finalArr = [];
            str = str.split("_");
            str.splice(0, 1);
            str.splice(-1, 1)
            str.splice(str.length, 1);
            for (i = 0; i < str.length; i++) {
                finalArr.push(str[i]);
            }
            return finalArr.map(x => {
                if (x == 2) {
                    return 1.4;
                } else if (x == 3) {
                    return 3.5;
                } else if (x == 4) {
                    return 4.5;
                } else {
                    return parseInt(x);
                }
            });
        }
        function getSpeed(str) {
            return parseInt(str.split("unit")[1].split(".mp3")[0]) / 1000;
        }
        function checkIfDiff(str) {
            str = str.split("IrregPatterns/")[1];
            str = str.split('-nm')[0];
            return str.includes('d');
        }
        function getDiffSeq(seq) {
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return parseFloat(ret.toFixed(2));
        }
        const seqColumn = detectColumn('AudIrreg');
        const userAnswerColumn = detectColumn('AudIrregResp');
        const answerColumn = detectColumn('AudIrregDiff');
        const atCheckAnswersColumn = detectColumn("AudIrregAttentionCh");
        var tmp = [];
        var tmpDif = null;
        var blocks = [];
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "AudIrreg") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    if (checkIfDiff(sheet[element].v) === true) {
                        tmpDif = sheet[`${answerColumn}${parseInt(row)}`];
                    }
                    tmp.push(getSeq(sheet[element].v));
                    var finalObj = {
                        seq: tmp,
                        speed: getSpeed(sheet[element].v),
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: tmpDif.v,
                        intervalDifference: getDiffSeq(tmp),
                        diffSeq: tmp[parseInt(tmpDif.v)]
                    }
                    blocks.push(finalObj);
                    tmp = [];
                    tmpDif = null;
                } else {
                    if (checkIfDiff(sheet[element].v) === true) {
                        tmpDif = sheet[`${answerColumn}${parseInt(row)}`];
                    }
                    tmp.push(getSeq(sheet[element].v));
                }
            }
        });
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "AudIrregAttentionCh") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === atCheckAnswersColumn) {
                if (sheet[element].v === "g") {
                    atCheckCorrectAnswers++;
                }
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
            }
            if (e.userAnswer == "g") {
                falseAlarms++;
            }
        });
        Finalized['AudIrreg'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };

    }
    function parseAudReg(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function getSeq(str) {
            str = str.split("RegPatterns/")[1];
            finalArr = [];
            str = str.split("_");
            str.splice(0, 1);
            str.splice(-1, 1)
            str.splice(str.length, 1);
            for (i = 0; i < str.length; i++) {
                finalArr.push(str[i]);
            }
            return finalArr;
        }
        function getSpeed(str) {
            return parseInt(str.split("unit")[1].split(".mp3")[0]) / 1000;
        }
        function checkIfDiff(str) {
            str = str.split("RegPatterns/")[1];
            str = str.split('-ms')[0];
            return str.includes('d');
        }
        function getDiffSeq(seq) {
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return parseFloat(ret.toFixed(2));
        }
        const seqColumn = detectColumn('AudReg');
        const userAnswerColumn = detectColumn('AudRegResp');
        const answerColumn = detectColumn('AudRegDiff');
        const atCheckAnswersColumn = detectColumn("AudRegAttentionCh");
        var tmp = [];
        var tmpDif = null;
        var blocks = [];
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "AudReg") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    if (checkIfDiff(sheet[element].v) === true) {
                        tmpDif = sheet[`${answerColumn}${parseInt(row)}`];
                    }
                    tmp.push(getSeq(sheet[element].v));
                    var finalObj = {
                        seq: tmp,
                        speed: getSpeed(sheet[element].v),
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: tmpDif.v,
                        intervalDifference: getDiffSeq(tmp),
                        diffSeq: tmp[parseInt(tmpDif.v)]
                    }
                    blocks.push(finalObj);
                    tmp = [];
                    tmpDif = null;
                } else {
                    if (checkIfDiff(sheet[element].v) === true) {
                        tmpDif = sheet[`${answerColumn}${parseInt(row)}`];
                    }
                    tmp.push(getSeq(sheet[element].v));
                }
            }
        });
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "AudRegAttentionCh") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === atCheckAnswersColumn) {
                if (sheet[element].v === "g") {
                    atCheckCorrectAnswers++;
                }
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['AudReg'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };

    }
    function parseAudSd(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function getSeq(str) {
            str = str.split("singleDurations/")[1];
            finalArr = [];
            str = str.split("_");
            finalArr.push(parseFloat(str[1]));
            return finalArr;
        }
        function getSpeed(str) {
            return parseInt(str.split("unit")[1].split(".mp3")[0]) / 1000;
        }
        function checkIfDiff(str) {
            str = str.split("singleDurations/")[1];
            str = str.split('-sd')[0];
            return str.includes('d');
        }
        function getDiffSeq(seq) {
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return parseFloat(ret.toFixed(2));
        }
        const seqColumn = detectColumn('AudSD');
        const userAnswerColumn = detectColumn('AudSDresp');
        const answerColumn = detectColumn('AudSDdiff');
        const atCheckAnswersColumn = detectColumn("AudSDAttentionCh");
        var tmp = [];
        var easyTrialFails = 0;
        var tmpDif = null;
        var blocks = [];
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "AudSD") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    if (checkIfDiff(sheet[element].v) === true) {
                        tmpDif = sheet[`${answerColumn}${parseInt(row)}`];
                    }
                    tmp.push(getSeq(sheet[element].v));
                    var finalObj = {
                        seq: tmp,
                        speed: getSpeed(sheet[element].v),
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: tmpDif.v,
                        intervalDifference: getDiffSeq(tmp),
                        diffSeq: tmp[parseInt(tmpDif.v)]
                    }
                    blocks.push(finalObj);
                    tmp = [];
                    tmpDif = null;
                } else {
                    if (checkIfDiff(sheet[element].v) === true) {
                        tmpDif = sheet[`${answerColumn}${parseInt(row)}`];
                    }
                    tmp.push(getSeq(sheet[element].v));
                }
            }
        });
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "AudSDAttentionCh") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === atCheckAnswersColumn) {
                if (sheet[element].v === "g") {
                    atCheckCorrectAnswers++;
                }
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.intervalDifference >= 2) {
                    easyTrialFails++;
                }
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['AudSd'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 42).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            easyTrialFails: easyTrialFails,
            falseAlarms
        };

    }
    function parseTactReg(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function parseSeq(seq) {
            final = [];
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }
            const size = seq.length / 3;
            while (seq.length > 0) {
                final.push(seq.splice(0, size).filter(unique)[0]);
            }
            return final;
        }
        function findIntervalDiff(seq) {
            if (seq[0].includes('10')) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq = seq.map(s => {
                return s.replace('[', '').replace(']', '').split(',').map(q => parseFloat(q));
            });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });

            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return ret;
        }
        const seqColumn = detectColumn('TactReg');
        const userAnswerColumn = detectColumn('TactRegResp');
        const speedColumn = detectColumn('TactRegSpeed');
        const answerColumn = detectColumn('TactRegDiff');
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        var blocks = [];
        var tmp = [];
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v === "TactReg") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                sheet["AC1699"]
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.seq[0].includes('10')) {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['TactReg'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };
    }
    function parseTactIrreg(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function parseSeq(seq) {
            final = [];
            const unique = (value, index, self) => {
                return self.indexOf(value) === index
            }
            const size = seq.length / 3;
            while (seq.length > 0) {
                final.push(seq.splice(0, size).filter(unique)[0]);
            }
            return final;
        }
        function findIntervalDiff(seq) {
            if (seq[0].includes('10')) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq = seq.map(s => {
                return s.replace('[', '').replace(']', '').split(',').map(q => parseFloat(q));
            });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });

            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return ret;
        }
        const seqColumn = detectColumn('TactIrreg');
        const userAnswerColumn = detectColumn('TactIrregResp');
        const speedColumn = detectColumn('TactIrregSpeed');
        const answerColumn = detectColumn('TactIrregDiff');
        var atCheckCorrectAnswers = 0;
        var falseAlarms = 0;
        var blocks = [];
        var tmp = [];
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v === "TactIrreg") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                sheet["AC1699"]
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.seq[0].includes('10')) {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['TactIrreg'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 30).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            falseAlarms
        };
    }
    function parseTactSD(sheet) {
        function detectColumn(col) {
            var ret = null;
            Object.keys(sheet).forEach(k => {
                if (ret == null) {
                    if (typeof sheet[k] === "object") {
                        if (sheet[k].v === col) {
                            ret = parseRange(k)[0];
                        }
                    }
                }
            });
            return ret;
        }
        function findIntervalDiff(seq) {
            if (seq[0].includes(10)) {
                return null;
            }
            var newArr = [];
            var ret = null;
            function isArrayInArray(arr, item) {
                var item_as_string = JSON.stringify(item);

                var contains = arr.some(function (ele) {
                    return JSON.stringify(ele) === item_as_string;
                });
                return contains;
            }
            const diffNumber = (arr1, arr2) => arr1.map(function (num, idx) { return num - arr2[idx] });
            seq.forEach(s => {
                t = [];
                s.forEach(x => t.push(x));
                if (!isArrayInArray(newArr, t)) {
                    newArr.push(t);
                }
            });
            diffNumber(newArr[0], newArr[1]).forEach(d => {
                if (ret == null) {
                    if (d !== 0) {
                        ret = Math.abs(d);
                    }
                }
            });
            return parseFloat(ret.toFixed(2));
        }
        function parseSeq(seq) {
            final = [];
            while (seq.length > 0) {
                final.push(seq.splice(0, 1));
            }
            return final;
        }
        const seqColumn = detectColumn('TactSD');
        const userAnswerColumn = detectColumn('TactSDresp');
        const speedColumn = detectColumn('TactSDspeed');
        const answerColumn = detectColumn('TactSDdiff');
        var atCheckCorrectAnswers = 0;
        var easyTrialFails = 0;
        var blocks = [];
        var tmp = [];
        var falseAlarms = 0;
        Object.keys(sheet).forEach(element => {
            if (sheet[element].v == "TactSD") {
                return;
            }
            var splited = parseRange(element);
            var column = splited[0];
            var row = splited[1];
            if (column === seqColumn) {
                if (sheet[`${seqColumn}${parseInt(row) + 1}`] == undefined) {
                    tmp.push(sheet[element].v);
                    var parsedSeq = parseSeq(tmp);
                    var finalObj = {
                        seq: parsedSeq,
                        userAnswer: sheet[`${userAnswerColumn}${parseInt(row) + 1}`]?.v,
                        correctAnswer: sheet[`${answerColumn}${parseInt(row)}`]?.v,
                        speed: sheet[`${speedColumn}${parseInt(row)}`]?.v,
                        diffSeq: parsedSeq[parseInt(sheet[`${answerColumn}${parseInt(row)}`]?.v) - 1],
                        intervalDifference: findIntervalDiff(parsedSeq)
                    }
                    blocks.push(finalObj);
                    tmp = [];
                } else {
                    tmp.push(sheet[element].v);
                }
            }
        });
        blocks.forEach((e, index) => {
            if (e.seq[0].includes(10)) {
                if (e.userAnswer == "g") {
                    atCheckCorrectAnswers++;
                }
                blocks.splice(index, 1);
            }
        });
        var cAnswerCount = 0;
        var wAnswerCount = 0;
        var TotIntervalDifferenceWrong = 0;
        var TotIntervalDifferenceCorrect = 0;
        blocks.forEach((e) => {
            if (e.correctAnswer == e.userAnswer) {
                cAnswerCount++;
                TotIntervalDifferenceCorrect += e.intervalDifference;
            } else {
                wAnswerCount++;
                TotIntervalDifferenceWrong += e.intervalDifference;
                if (e.intervalDifference >= 2) {
                    easyTrialFails++;
                }
                if (e.userAnswer == "g") {
                    falseAlarms++;
                }
            }
        });
        Finalized['TactSD'] = {
            data: blocks,
            AttentionCheckAnswers: atCheckCorrectAnswers,
            Correct: cAnswerCount,
            Wrong: wAnswerCount,
            Score: parseFloat((cAnswerCount / 42).toFixed(2)),
            IntDiffAverageCorrect: parseFloat((TotIntervalDifferenceCorrect / cAnswerCount).toFixed(2)) || 0,
            IntDiffAverageWrong: parseFloat((TotIntervalDifferenceWrong / wAnswerCount).toFixed(2)) || 0,
            easyTrialFails: easyTrialFails,
            falseAlarms
        };
    }
    parseVisReg(sheet);
    /*parseVisIrreg(sheet);
    parseVisRegRot(sheet);
    parseVisIrregRot(sheet);
    /* parseVisSd(sheet);
    parseAudIrreg(sheet);
    parseAudReg(sheet);
    parseAudSd(sheet);
    parseTactReg(sheet);
    parseTactIrreg(sheet);
    parseTactSD(sheet); */
    fs.writeFileSync(`../data/3_json_files/Processed ${formatFileName(fileName)}.json`, JSON.stringify({ ...Finalized }), (err) => { //creates JS files

    });
}
function processJson(fileName) {
    function getParticipantName(file) {
        return file.split('Processed Preprocessed')[1].split(".")[0];
    }
    var file = require(`../data/3_json_files/${fileName}`);
    finalExcel[getParticipantName(fileName)] = [

        `${file.VisReg.Score} [${2 - parseInt(file.VisReg.AttentionCheckAnswers)}] (${file.VisReg.falseAlarms})`, // I changed 2 to 1 (zh)
        /*`${file.VisIrreg.Score} [${2 - parseInt(file.VisIrreg.AttentionCheckAnswers)}] (${file.VisIrreg.falseAlarms})`,
        `${file.VisRegRot.Score} [${2 - parseInt(file.VisRegRot.AttentionCheckAnswers)}] (${file.VisRegRot.falseAlarms})`,
        `${file.VisIrregRot.Score} [${2 - parseInt(file.VisIrregRot.AttentionCheckAnswers)}] (${file.VisIrregRot.falseAlarms})`,*/
        file.VisReg.Score,
        /*file.VisIrreg.Score,
        file.VisRegRot.Score,
        file.VisIrregRot.Score,*/
        file.VisReg.IntDiffAverageCorrect,
        file.VisReg.IntDiffAverageWrong,
        /*file.VisIrreg.IntDiffAverageCorrect,
        file.VisIrreg.IntDiffAverageWrong,
        file.VisRegRot.IntDiffAverageCorrect,
        file.VisRegRot.IntDiffAverageWrong,
        file.VisIrregRot.IntDiffAverageCorrect,
        file.VisIrregRot.IntDiffAverageWrong,
        /* `${file.AudSd.Score} [${2 - parseInt(file.AudSd.AttentionCheckAnswers)}] (${file.AudSd.falseAlarms}) {${file.AudSd.easyTrialFails}}`,
        `${file.AudIrreg.Score} [${2 - parseInt(file.AudIrreg.AttentionCheckAnswers)}] (${file.AudIrreg.falseAlarms})`,
        `${file.AudReg.Score} [${2 - parseInt(file.AudReg.AttentionCheckAnswers)}] (${file.AudReg.falseAlarms})`,
        `${file.VisSD.Score} [${2 - parseInt(file.VisSD.AttentionCheckAnswers)}] (${file.VisSD.falseAlarms}) {${file.VisSD.easyTrialFails}}`,
        `${file.VisIrreg.Score} [${2 - parseInt(file.VisIrreg.AttentionCheckAnswers)}] (${file.VisIrreg.falseAlarms})`,
        `${file.VisReg.Score} [${2 - parseInt(file.VisReg.AttentionCheckAnswers)}] (${file.VisReg.falseAlarms})`,
        `${file.TactSD.Score} [${2 - parseInt(file.TactSD.AttentionCheckAnswers)}] (${file.TactSD.falseAlarms}) {${file.TactSD.easyTrialFails}}`,
        `${file.TactIrreg.Score} [${2 - parseInt(file.TactIrreg.AttentionCheckAnswers)}] (${file.TactIrreg.falseAlarms})`,
        `${file.TactReg.Score} [${2 - parseInt(file.TactReg.AttentionCheckAnswers)}] (${file.TactReg.falseAlarms})`,
        file.AudSd.Score,
        file.AudIrreg.Score,
        file.AudReg.Score,
        file.VisSD.Score,
        file.VisIrreg.Score,
        file.VisReg.Score,
        file.TactSD.Score,
        file.TactIrreg.Score,
        file.TactReg.Score,
        file.AudSd.IntDiffAverageCorrect,
        file.AudSd.IntDiffAverageWrong,
        file.AudIrreg.IntDiffAverageCorrect,
        file.AudIrreg.IntDiffAverageWrong,
        file.AudReg.IntDiffAverageCorrect,
        file.AudReg.IntDiffAverageWrong,
        file.VisSD.IntDiffAverageCorrect,
        file.VisSD.IntDiffAverageWrong,
        file.VisIrreg.IntDiffAverageCorrect,
        file.VisIrreg.IntDiffAverageWrong,
        file.VisReg.IntDiffAverageCorrect,
        file.VisReg.IntDiffAverageWrong,
        file.TactSD.IntDiffAverageCorrect,
        file.TactSD.IntDiffAverageWrong,
        file.TactIrreg.IntDiffAverageCorrect,
        file.TactIrreg.IntDiffAverageWrong,
        file.TactReg.IntDiffAverageCorrect,
        file.TactReg.IntDiffAverageWrong, */
    ];
}
function makeExcel(finalExcel) {
    function formatFileName(file) {
        return file.replace(/\.[^/.]+$/, "")
    }
    function getParticipantName(file) {
        return file.split('Processed Preprocessed')[1].split(".")[0];
    }
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Sheet 1');
    worksheet.cell(1, 1).string('Name');
    worksheet.cell(1, 2).string('VisReg');
    worksheet.cell(1, 4).string('VisReg');
    worksheet.cell(1, 6).string('VisRegIntDiff (T)');
    worksheet.cell(1, 7).string('VisRegIntDiff (F)');

    /*worksheet.cell(1, 7).string('VisReg');
    worksheet.cell(1, 8).string('VisIrreg');
    worksheet.cell(1, 9).string('VisRegRot');
    worksheet.cell(1, 10).string('VisIrregRot');

    worksheet.cell(1, 12).string('VisRegIntDiff (T)');
    worksheet.cell(1, 13).string('VisRegIntDiff (F)');
    worksheet.cell(1, 14).string('VisIrregIntDiff (T)');
    worksheet.cell(1, 15).string('VisIrregIntDiff (F)');
    worksheet.cell(1, 16).string('VisRegRotIntDiff (T)');
    worksheet.cell(1, 17).string('VisRegRotIntDiff (F)');
    worksheet.cell(1, 18).string('VisIrregRotIntDiff (T)');
    worksheet.cell(1, 19).string('VisIrregRotIntDiff (F)');
    /* worksheet.cell(1, 1).string('Name');
    worksheet.cell(1, 2).string('AudSD');
    worksheet.cell(1, 3).string('AudIrreg');
    worksheet.cell(1, 4).string('AudReg');
    worksheet.cell(1, 5).string('VisSD');
    worksheet.cell(1, 6).string('VisIrreg');
    worksheet.cell(1, 7).string('VisReg');
    worksheet.cell(1, 8).string('TactSD');
    worksheet.cell(1, 9).string('TactIrreg');
    worksheet.cell(1, 10).string('TactReg');

    worksheet.cell(1, 12).string('AudSD');
    worksheet.cell(1, 13).string('AudIrreg');
    worksheet.cell(1, 14).string('AudReg');
    worksheet.cell(1, 15).string('VisSD');
    worksheet.cell(1, 16).string('VisIrreg');
    worksheet.cell(1, 17).string('VisReg');
    worksheet.cell(1, 18).string('TactSD');
    worksheet.cell(1, 19).string('TactIrreg');
    worksheet.cell(1, 20).string('TactReg')

    worksheet.cell(1, 22).string('AudSDIntDiff (T)');
    worksheet.cell(1, 23).string('AudSDIntDiff (F)');
    worksheet.cell(1, 24).string('AudIrregIntDiff (T)');
    worksheet.cell(1, 25).string('AudIrregIntDiff (F)');
    worksheet.cell(1, 26).string('AudRegIntDiff (T)');
    worksheet.cell(1, 27).string('AudRegIntDiff (F)');
    worksheet.cell(1, 28).string('VisSDIntDiff (T)');
    worksheet.cell(1, 29).string('VisSDIntDiff (F)');
    worksheet.cell(1, 30).string('VisIrregIntDiff (T)');
    worksheet.cell(1, 31).string('VisIrregIntDiff (F)');
    worksheet.cell(1, 32).string('VisRegIntDiff (T)');
    worksheet.cell(1, 33).string('VisRegIntDiff (F)');
    worksheet.cell(1, 34).string('TactSDIntDiff (T)');
    worksheet.cell(1, 35).string('TactSDIntDiff (F)');
    worksheet.cell(1, 36).string('TactIrregIntDiff (T)');
    worksheet.cell(1, 37).string('TactIrregIntDiff (F)');
    worksheet.cell(1, 38).string('TactRegIntDiff (T)');
    worksheet.cell(1, 39).string('TactRegIntDiff (F)'); */

    var x = 2;
    Object.keys(finalExcel).forEach(key => {
        var name = key;
        worksheet.cell(x, 1).string(name);
        worksheet.cell(x, 2).string(finalExcel[key][0]);
        worksheet.cell(x, 4).number(finalExcel[key][1]);
        worksheet.cell(x, 6).number(finalExcel[key][2]);
        worksheet.cell(x, 7).number(finalExcel[key][3]);

        /*worksheet.cell(x, 7).number(finalExcel[key][4]);
        worksheet.cell(x, 8).number(finalExcel[key][5]);
        worksheet.cell(x, 9).number(finalExcel[key][6]);
        worksheet.cell(x, 10).number(finalExcel[key][7]);

        worksheet.cell(x, 12).number(finalExcel[key][8]);
        worksheet.cell(x, 13).number(finalExcel[key][9]);
        worksheet.cell(x, 14).number(finalExcel[key][10]);
        worksheet.cell(x, 15).number(finalExcel[key][11]);
        worksheet.cell(x, 16).number(finalExcel[key][12]);
        worksheet.cell(x, 17).number(finalExcel[key][13]);
        worksheet.cell(x, 18).number(finalExcel[key][14]);
        worksheet.cell(x, 19).number(finalExcel[key][15]);

        /* worksheet.cell(x, 2).string(finalExcel[key][0]);
        worksheet.cell(x, 3).string(finalExcel[key][1]);
        worksheet.cell(x, 4).string(finalExcel[key][2]);
        worksheet.cell(x, 5).string(finalExcel[key][3]);
        worksheet.cell(x, 6).string(finalExcel[key][4]);
        worksheet.cell(x, 7).string(finalExcel[key][5]);
        worksheet.cell(x, 8).string(finalExcel[key][6]);
        worksheet.cell(x, 9).string(finalExcel[key][7]);
        worksheet.cell(x, 10).string(finalExcel[key][8]);


        worksheet.cell(x, 12).number(finalExcel[key][9]);
        worksheet.cell(x, 13).number(finalExcel[key][10]);
        worksheet.cell(x, 14).number(finalExcel[key][11]);
        worksheet.cell(x, 15).number(finalExcel[key][12]);
        worksheet.cell(x, 16).number(finalExcel[key][13]);
        worksheet.cell(x, 17).number(finalExcel[key][14]);
        worksheet.cell(x, 18).number(finalExcel[key][15]);
        worksheet.cell(x, 19).number(finalExcel[key][16]);
        worksheet.cell(x, 20).number(finalExcel[key][17]);

        worksheet.cell(x, 22).number(finalExcel[key][18]);
        worksheet.cell(x, 23).number(finalExcel[key][19]);
        worksheet.cell(x, 24).number(finalExcel[key][20]);
        worksheet.cell(x, 25).number(finalExcel[key][21]);
        worksheet.cell(x, 26).number(finalExcel[key][22]);
        worksheet.cell(x, 27).number(finalExcel[key][23]);
        worksheet.cell(x, 28).number(finalExcel[key][24]);
        worksheet.cell(x, 29).number(finalExcel[key][25]);
        worksheet.cell(x, 30).number(finalExcel[key][26]);
        worksheet.cell(x, 31).number(finalExcel[key][27]);
        worksheet.cell(x, 32).number(finalExcel[key][28]);
        worksheet.cell(x, 33).number(finalExcel[key][29]);
        worksheet.cell(x, 34).number(finalExcel[key][30]);
        worksheet.cell(x, 35).number(finalExcel[key][31]);
        worksheet.cell(x, 36).number(finalExcel[key][32]);
        worksheet.cell(x, 37).number(finalExcel[key][33]);
        worksheet.cell(x, 38).number(finalExcel[key][34]);
        worksheet.cell(x, 39).number(finalExcel[key][35]); */
        x++;
    });
    workbook.write("../results/PrimaryResults_vistraining.xlsx");
}
function makeJsonFromXlsx() {

    fs.readdir('../data/2_preprocessed_data/', (err, files) => {
        files.forEach(file => {
            if (file.endsWith("xlsx") && !file.startsWith("~")) {
                console.log(`Processing ${file}`)
                processFile(file);
            }
        });
    });
}
function makeFinalExcelFromJsons() {
    fs.readdir('../data/3_json_files', (err, files) => {
        files.forEach(file => {
            if (file.endsWith('json')) {
                processJson(file);
            }
        });
        makeExcel(finalExcel);
    });
}
// makeJsonFromXlsx(); // Convert XLSX files From 2_preprocessed_data folder to seperate JSON files and store them in 3_json_files. Run this function before makeFinalExcelFromJsons function.
makeFinalExcelFromJsons(); // Convert JSON files in 3_json_files folder to a single Excel file (PrimaryResults_vistraining). Do not run this function before having JSON files in 3_json_files folder.

// In the final excel file:
// [] > attention check failure
// () > false alarm
// {} > easy trials failure, in just single duration blocks