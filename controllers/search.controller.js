const libgen = require('libgen');
exports.searchLibrary = async(req, res) => {
    const {query} = req.body;
    const urlString = await libgen.mirror();
    const options = {
        mirror: urlString,
        query: query,
        count: 15,
        sort_by: 'year',
        reverse: true
    }
    let data;
    const libgenModel = [];
    try {
        data = await libgen.search(options)
        let n = data.length
        console.log(`${n} results for "${options.query}"`)
        while (n--){
            let url = await libgen.utils.check.canDownload(data[n].md5);
            if(url){    
                libgenModel.push({  
                    title : data[n].title,
                    author : data[n].author,
                    download : url
                })
            }
        }
    } catch (err) {
        throw err;
    }
    if (data.length) return res.json({ libgenModel });
    return res.json({ error: `no files found for ${query}` });
}