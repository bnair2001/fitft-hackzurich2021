const goals = [2000, 2000, 3000, 3000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000]

// main
function breed(pt1, pt2){
    let t_pt1 = tokenize(pt1)
    let t_pt2 = tokenize(pt2)

    t_pt1 = t_pt1.filter(tok => tok !== 0)
    t_pt2 = t_pt2.filter(tok => tok !== 0)

    let child_pt = Math.min(Math.min(...t_pt1), Math.min(...t_pt2))

    if (child_pt <= 9){
        child_pt = '0' + child_pt.toString()
    } else {
        child_pt = child_pt.toString()
    }

    const pos = randomNumber(0, 8)

    patt = ['00','00', '00','00','00', '00', '00','00', '00']
    patt[pos] = child_pt

    return patt.join("")
}

function evolve(pt1, pt2){
    let t_pt1 = tokenize(pt1)
    let t_pt2 = tokenize(pt2)

    let evolved_pt = Math.max(Math.max(...t_pt1), Math.max(...t_pt2))

    return {
        "pt1": untokenize(evolver(t_pt1, evolved_pt)),
        "pt2": untokenize(evolver(t_pt2, evolved_pt))
    }
}

// console.log(evolve("056700003412008400", "080000001812004708"))

// helpers

function evolver(tpt, evolved_pt){
    if (tpt.indexOf(0) !== -1){
        let zero_indices = getAllIndexes(tpt, 0)
        let random_ix = zero_indices[Math.floor(Math.random()*zero_indices.length)]
        tpt[random_ix] = evolved_pt
    } else {
        let ix = tpt.indexOf(Math.min(...tpt))
        tpt[ix] = evolved_pt
    }
    return tpt
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function randomNumber(min, max) { 
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
} 

function tokenize(string){
    let cursor = 2
    let pts = []
    for (var i=1;i<=9; i++) {
        pts.push(parseInt(string.substring((cursor - 2), cursor)))
        cursor = cursor + 2
    }
    return pts
}

function untokenize(tokend){
    let string = ""
    for (let tok of tokend){
        if ( tok <= 9){
            string = string + ('0' + tok.toString())
        } else {
            string = string + tok.toString()
        }
    }
    return string
}

