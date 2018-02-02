import async from './axios_cofig';

// const baseProxy = '';
const baseProxy = 'https://bird.ioliu.cn/v1/?url=';
// const chapterProxy = 'http://books:9095';
const chapterProxy = 'http://123.56.128.161:88';
// const chapterProxy = 'http://chapter2.zhuishushenqi.com';
// const chapterProxy = 'http://novel.juhe.im';
const baseURL = 'http://api.zhuishushenqi.com';

export default {
  getFeaturedData() {
    return async(baseProxy + baseURL + '/recommendPage/nodes/5910018c8094b1e228e5868f')
      .then(data => data.data);
  },

  getBooks(id) {
    return async(baseProxy + baseURL + '/recommendPage/books/' + id)
      .then(data => data.data);
  },

  getSwiperPictures() {
    return async(baseProxy + baseURL + '/recommendPage/node/spread/575f74f27a4a60dc78a435a3', {
      pl: 'ios'
    })
      .then(data => data.data);
  },

  getCategory() {
    return async(baseProxy + baseURL + '/cats/lv2/statistics');
  },

  getMinorList() {
    return async(baseProxy + baseURL + '/cats/lv2');
  },

  getCatBooks(gender, type = 'hot', major = '', minor = '', start = 0, limit = 20) {
    return async(baseProxy + baseURL + '/book/by-categories', {
      gender: gender,
      type: type,
      major: major,
      minor: minor,
      start: start,
      limit: limit
    })
      .then(data => data.books);
  },

  getRanks() {
    return async(baseProxy + baseURL + '/ranking/gender');
  },

  getRankBooks(id) {
    return async(baseProxy + baseURL + '/ranking/' + id);
  },

  getBookList(id, st = 1, size = 10) {
    return async(baseProxy + baseURL + '/recommendPage/node/books/all/' + id, {
      ajax: 'ajax',
      st: st,
      size: size
    }, 'post');
  },

  getBook(id) {
    return async(baseProxy + baseURL + '/book/' + id);
  },

  getReview(id, limit = 5) {
    return async(baseProxy + baseURL + '/post/review/best-by-book', {
      book: id,
      limit: limit
    }).then(data => data.reviews);
  },

  getRecommend(id) {
    return async(baseProxy + baseURL + '/book/' + id + '/recommend')
      .then(data => data.books);
  },

  getSouces(id) {
    return async(baseProxy + baseURL + '/toc', {
      view: 'summary',
      book: id
    });
  },
  getChapters1(id) {
    return async(baseProxy + baseURL + '/btoc/' + id, {
      view: 'chapters',
      channel: 'mweb'
    }).then(data => {
      return data.chapters;
    });
  },

  getChapters(id, sourceId) {
    return async(baseProxy + baseURL + '/toc', {
      view: 'summary',
      book: id
    }).then(data1 => {
      return async(baseProxy + baseURL + '/btoc/' + (sourceId === 0 ? data1[0]._id : sourceId), {
        view: 'chapters',
        channel: 'mweb'
      }).then(data => {
        return [data1, data.chapters];
      });
    });
  },

  getChapterContent(url) {
    return async(chapterProxy + '/chapter', {
      url: encodeURIComponent(url)
    }).then(result => {
        return result.chapter.title + result.chapter.body + result.chapter.cpContent;
      });
  },

  getShelfBookUpdate(ids) {
    return async(baseProxy + baseURL + '/book', {
      view: 'updated',
      id: ids.toString()
    });
  },

  getSearchHotKeywords() {
    return async(baseProxy + baseURL + '/book/search-hotwords')
      .then(data => data.searchHotWords);
  },

  searchByKeyword(keyword) {
    return async(baseProxy + baseURL + '/book/fuzzy-search', {
      query: keyword,
      start: '0',
      limit: '100',
      v: '1'
    }).then(data => data.books);
  }
};
