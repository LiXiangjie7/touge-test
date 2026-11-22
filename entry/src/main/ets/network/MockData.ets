import { BannerItem, HotSearch, Playlist, RankList, Song } from '../model/Models';

/**
 * 本地 Mock 数据源。
 * 考核允许使用 Mock 接口：MockApi 以异步方式（模拟网络延迟 + 可注入异常）
 * 对本数据源进行读取，等价于一个云端 Mock 服务。
 * 音频流使用公开的测试音频，封面使用 picsum 占位图服务。
 */

const COVER = (seed: string): string => `https://picsum.photos/seed/${seed}/300/300`;
const AUDIO = (n: number): string => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

const LYRIC_A: string[] = [
  '微风掠过安静的街道',
  '把心事唱给远方的云听',
  '灯光落在熟悉的窗台',
  '这一刻 旋律只属于你',
  '让节奏带走所有疲惫',
  '明天依然值得期待'
];

const LYRIC_B: string[] = [
  '夜色温柔地包裹城市',
  '耳机里是熟悉的旋律',
  '回忆像电影一帧帧闪过',
  '你笑着说 别停下脚步',
  '把梦想装进口袋继续走',
  '星光会照亮前行的路'
];

const LYRIC_C: string[] = [
  '鼓点敲醒沉睡的心跳',
  '让热血在血管里燃烧',
  '不管世界有多少喧嚣',
  '这一刻我们只要咆哮',
  '高举双手跟着节拍跳',
  '青春就要尽情地闹'
];

export const MOCK_SONGS: Song[] = [
  { id: 101, name: '晴天', artist: '周杰伦', album: '叶惠美', cover: COVER('song101'), playUrl: AUDIO(1), duration: 273000, genre: '流行', playCount: 9860000, lyric: LYRIC_A },
  { id: 102, name: '七里香', artist: '周杰伦', album: '七里香', cover: COVER('song102'), playUrl: AUDIO(2), duration: 296000, genre: '流行', playCount: 8750000, lyric: LYRIC_B },
  { id: 103, name: '江南', artist: '林俊杰', album: '第二天堂', cover: COVER('song103'), playUrl: AUDIO(3), duration: 268000, genre: '流行', playCount: 7630000, lyric: LYRIC_A },
  { id: 104, name: '光年之外', artist: '邓紫棋', album: '光年之外', cover: COVER('song104'), playUrl: AUDIO(4), duration: 235000, genre: '流行', playCount: 8120000, lyric: LYRIC_B },
  { id: 105, name: '模特', artist: '李荣浩', album: '模特', cover: COVER('song105'), playUrl: AUDIO(5), duration: 288000, genre: '流行', playCount: 5340000, lyric: LYRIC_A },
  { id: 106, name: '演员', artist: '薛之谦', album: '绅士', cover: COVER('song106'), playUrl: AUDIO(6), duration: 262000, genre: '流行', playCount: 6980000, lyric: LYRIC_B },
  { id: 107, name: '消愁', artist: '毛不易', album: '平凡的一天', cover: COVER('song107'), playUrl: AUDIO(7), duration: 279000, genre: '民谣', playCount: 7210000, lyric: LYRIC_A },
  { id: 108, name: '成都', artist: '赵雷', album: '无法长大', cover: COVER('song108'), playUrl: AUDIO(8), duration: 329000, genre: '民谣', playCount: 6890000, lyric: LYRIC_B },
  { id: 109, name: '云烟成雨', artist: '房东的猫', album: '柔软', cover: COVER('song109'), playUrl: AUDIO(9), duration: 253000, genre: '民谣', playCount: 4560000, lyric: LYRIC_A },
  { id: 110, name: '雅俗共赏', artist: '许嵩', album: '青年晚报', cover: COVER('song110'), playUrl: AUDIO(10), duration: 251000, genre: '流行', playCount: 3980000, lyric: LYRIC_B },
  { id: 111, name: '奇妙能力歌', artist: '陈粒', album: '如也', cover: COVER('song111'), playUrl: AUDIO(11), duration: 244000, genre: '民谣', playCount: 4120000, lyric: LYRIC_A },
  { id: 112, name: '山海', artist: '草东没有派对', album: '丑奴儿', cover: COVER('song112'), playUrl: AUDIO(12), duration: 282000, genre: '摇滚', playCount: 5670000, lyric: LYRIC_C },
  { id: 113, name: '爱人错过', artist: '告五人', album: '我肯定在几百年前就说过爱你', cover: COVER('song113'), playUrl: AUDIO(13), duration: 291000, genre: '摇滚', playCount: 6230000, lyric: LYRIC_C },
  { id: 114, name: '倔强', artist: '五月天', album: '神的孩子都在跳舞', cover: COVER('song114'), playUrl: AUDIO(14), duration: 261000, genre: '摇滚', playCount: 7450000, lyric: LYRIC_C },
  { id: 115, name: '浮夸', artist: '陈奕迅', album: 'U87', cover: COVER('song115'), playUrl: AUDIO(15), duration: 282000, genre: '流行', playCount: 5870000, lyric: LYRIC_B },
  { id: 116, name: '大鱼', artist: '周深', album: '深的深', cover: COVER('song116'), playUrl: AUDIO(16), duration: 313000, genre: '古风', playCount: 8340000, lyric: LYRIC_A },
  { id: 117, name: '溯', artist: '胡梦周 / 马吟吟', album: '溯', cover: COVER('song117'), playUrl: AUDIO(1), duration: 225000, genre: '电子', playCount: 5120000, lyric: LYRIC_B },
  { id: 118, name: '星尘回响', artist: '电子银河', album: '星尘', cover: COVER('song118'), playUrl: AUDIO(2), duration: 248000, genre: '电子', playCount: 2890000, lyric: LYRIC_C },
  { id: 119, name: '赤伶', artist: 'HITA', album: '赤伶', cover: COVER('song119'), playUrl: AUDIO(3), duration: 267000, genre: '古风', playCount: 4760000, lyric: LYRIC_A },
  { id: 120, name: '牵丝戏', artist: '银临 / Aki阿杰', album: '腐草为萤', cover: COVER('song120'), playUrl: AUDIO(4), duration: 238000, genre: '古风', playCount: 4320000, lyric: LYRIC_B }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  { id: 1, name: '华语流行精选｜耳朵会怀孕系列', cover: COVER('playlist1'), description: '精选华语乐坛高传唱度流行金曲，首首经典。', playCount: 23560000, creator: '云乐官方', tags: ['华语', '流行'], songIds: [101, 102, 103, 104, 105, 106, 110, 115] },
  { id: 2, name: '深夜民谣电台｜治愈你的小情绪', cover: COVER('playlist2'), description: '一把吉他一个故事，深夜里最温柔的声音。', playCount: 12890000, creator: '民谣小站', tags: ['民谣', '治愈'], songIds: [107, 108, 109, 111] },
  { id: 3, name: '摇滚不熄｜永远年轻永远热泪盈眶', cover: COVER('playlist3'), description: '鼓点与嘶吼，献给每一个不甘平庸的灵魂。', playCount: 9870000, creator: '摇滚现场', tags: ['摇滚', '乐队'], songIds: [112, 113, 114] },
  { id: 4, name: '电子脉冲｜律动加载中', cover: COVER('playlist4'), description: '合成器与低频的碰撞，瞬间点燃氛围。', playCount: 6540000, creator: '电音工厂', tags: ['电子', '律动'], songIds: [117, 118] },
  { id: 5, name: '古风雅韵｜一曲入梦', cover: COVER('playlist5'), description: '戏腔婉转，余音绕梁，国风之美尽在其中。', playCount: 8930000, creator: '古风雅集', tags: ['古风', '国风'], songIds: [116, 119, 120] },
  { id: 6, name: '学习专注｜沉浸式歌单', cover: COVER('playlist6'), description: '低干扰旋律，陪你高效学习与工作。', playCount: 15230000, creator: '云乐官方', tags: ['学习', '轻音乐'], songIds: [107, 109, 111, 116, 119, 120] }
];

export const MOCK_BANNERS: BannerItem[] = [
  { id: 1, image: COVER('banner1'), title: '华语流行精选', playlistId: 1 },
  { id: 2, image: COVER('banner2'), title: '深夜民谣电台', playlistId: 2 },
  { id: 3, image: COVER('banner3'), title: '摇滚不熄', playlistId: 3 },
  { id: 4, image: COVER('banner4'), title: '学习专注歌单', playlistId: 6 }
];

export const MOCK_RANKS: RankList[] = [
  { id: 1, name: '飙升榜', cover: COVER('rank1'), updateTip: '每日更新', songIds: [117, 118, 113, 109, 104] },
  { id: 2, name: '热歌榜', cover: COVER('rank2'), updateTip: '每日更新', songIds: [101, 103, 106, 115, 105, 102] },
  { id: 3, name: '新歌榜', cover: COVER('rank3'), updateTip: '每周三更新', songIds: [120, 119, 117, 116] },
  { id: 4, name: '原创榜', cover: COVER('rank4'), updateTip: '每周四更新', songIds: [112, 113, 111, 108] }
];

export const MOCK_HOT_SEARCH: HotSearch[] = [
  { keyword: '周杰伦', score: 982000 },
  { keyword: '周深 大鱼', score: 876000 },
  { keyword: '民谣', score: 765000 },
  { keyword: '五月天', score: 701000 },
  { keyword: '晚安曲', score: 654000 },
  { keyword: '薛之谦', score: 598000 },
  { keyword: '摇滚现场', score: 540000 },
  { keyword: '学习 纯音乐', score: 489000 },
  { keyword: '古风', score: 432000 },
  { keyword: '电子', score: 377000 }
];
