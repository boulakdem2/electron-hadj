import { selector, selectorFamily } from 'recoil';
import ipc from './ipc';

export const comicList = selector({
  key: 'comicList',
  get: () => ipc.fetchComicList(),
});

function sortImgList(imgList) {
  const list = [...imgList];

  function tonum(name) {
    const num = Number(name.replace(/[^\d]/g, '')) || Infinity;
    return num;
  }

  list.sort((a, b) => {
    if (a.name) {
      a.list = sortImgList(a.list || []);
    }
    if (b.name) {
      b.list = sortImgList(b.list || []);
    }

    if (a.name && b.name) {
      return tonum(a.name) - tonum(b.name);
    }

    if (!a.name && !b.name) {
      return tonum(a) - tonum(b);
    }
    if (a.name) {
      return 1;
    }

    return -1;
  });

  return list;
}

export const comicDetail = selectorFamily({
  key: 'comicDetailFamily',
  get: (id) => async () => {
    const [comic, imgList] = await Promise.all([
      ipc.fetchComic(id),
      ipc.fetchImgList(id),
    ]);

    return {
      comic,
      imgList: sortImgList(imgList),
    };
  },
});