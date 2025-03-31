import request from '../utils/request';

export const baseUrl = 'http://localhost:8081';

export const adminlogin = form => {
    return request.post(`${baseUrl}/Login/login`,form);
};


// 用户管理
export const getUsers = query => {
    return request({
        url: `${baseUrl}/User/getUsers`,
        method: 'get'
    });
};


// 商品管理

export const getGood = query => {
    return request({
        url: `${baseUrl}/Good/getGood`,
        method: 'get',
        params: query
    });
};

export const getGoodByCategory = query => {
    return request({
        url: `${baseUrl}/Good/getGoodById`,
        method: 'get',
        params: query
    });
};
export const getGoodByName = query => {
    return request({
        url: `${baseUrl}/Good/getGoodByName`,
        method: 'get',
        params: query
    });
};
export const updGood = query => {
    return request({
        url: `${baseUrl}/Good/updGood`,
        method: 'post',
        params: query
    });
};



export const getGoodPicByCategory = query => {
    return request({
        url: `${baseUrl}/Good/getGoodPicById`,
        method: 'get',
        params: query
    });
};
export const getGoodPicByName = query => {
    return request({
        url: `${baseUrl}/Good/getGoodPicByName`,
        method: 'get',
        params: query
    });
};


export const getSugFoot = query => { return request.post(`${baseUrl}/Suggest/getSugFoot`,query)};


export const getSugBig = kind => { return request({
    url:`${baseUrl}/Suggest/getSugBig`,
    method: 'get',
    params: {kind :kind}
    })
};
export const delSuggBig = query => {return request.post(`${baseUrl}/Suggest/delSugBig`,query);};
export const pushSuggBig = (id,kind) => {
    return request({
        url: `${baseUrl}/Suggest/pushSuggBig`,
        method: 'get',
        params: { goodid:id,kind:kind}
    });
};





export const pushGood = query => { return request.post(`${baseUrl}/Good/pushGood`,query)};

export const pushSuggFoot = query => { return request.post(`${baseUrl}/Suggest/pushSuggFoot`,query)};

export const updSuggFoot = query => { return request.post(`${baseUrl}/Suggest/updSuggFoot`,query)};

export const delSuggFoot = query => {
    return request.post(`${baseUrl}/Suggest/delSuggFoot`,query);
};



export const delGood = query => {
    return request.post(`${baseUrl}/Good/delGood`,query);
};
export const delMulGood = query => {
    return request.post(`${baseUrl}/Good/delMulGood`,query);
};


export const getGoodPic = query => {
  return request({
    url: `${baseUrl}/Good/getGoodPic`,
    method: 'get',
    params: query
  });
};

export const updGoodPic = query => {
    return request.post(`${baseUrl}/Good/updGoodPic`,query
    );
};

export const getGoodCate = query => {
    return request({
        url: `${baseUrl}/category/getCategory`,
        method: 'get',
        params: query
    });
};
export const updateGoodCate = form => {
    return request.post(`${baseUrl}/category/updateCategory`,form);
};






export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};


