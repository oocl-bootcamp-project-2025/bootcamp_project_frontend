// 模拟数据生成工具

// 默认景点数据
export const DEFAULT_ITINERARY = {
  day1: [
    {
      id: 'attraction1',
      name: '天安门广场',
      description: '中华人民共和国首都北京市的城市广场，位于北京市中心',
      duration: '2小时',
      time: '09:00-11:00',
      location: '东城区',
      images: ['https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=500'],
      experts: []
    },
    {
      id: 'attraction2',
      name: '故宫博物院',
      description: '明清两朝的皇家宫殿，现为综合性博物馆',
      duration: '3小时',
      time: '13:00-16:00',
      location: '东城区',
      images: ['https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500'],
      experts: []
    }
  ],
  day2: [
    {
      id: 'attraction3',
      name: '长城',
      description: '中国古代的军事防御工程',
      duration: '4小时',
      time: '09:00-13:00',
      location: '延庆区',
      images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=500'],
      experts: []
    }
  ],
  day3: [
    {
      id: 'attraction4',
      name: '颐和园',
      description: '中国清朝时期皇家园林',
      duration: '3小时',
      time: '10:00-13:00',
      location: '海淀区',
      images: ['https://images.unsplash.com/photo-1573036740506-3ab71ab6cf8e?w=500'],
      experts: []
    },
    {
      id: 'attraction5',
      name: '圆明园',
      description: '历史悠久的皇家园林遗址',
      duration: '2小时',
      time: '14:30-16:30',
      location: '海淀区',
      images: ['https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=500'],
      experts: []
    }
  ]
};

// 专家文章内容生成
export const ARTICLE_CONTENTS = {
  '天安门的日出与历史印记': `每一个日出都见证着历史的变迁，在这里感受时间的流逝和文化的传承。

作为一名土生土长的北京人，我有幸见证了天安门广场在不同时代的变迁。每当黎明时分，当第一缕阳光洒向这片古老而神圣的土地时，我总能感受到历史的厚重和文化的传承。

天安门广场的日出有着独特的魅力。清晨5点半，当城市还在沉睡中时，我已经站在了广场的最佳观景位置。随着东方天际逐渐泛白，远山如黛，近水如镜，整个广场在晨光中显得格外庄严肃穆。

这里不仅仅是一个观看日出的地方，更是一个承载着历史记忆的文化象征。从明朝的皇城大门，到今天的人民广场，每一寸土地都诉说着中华民族的历史变迁。

建议大家一定要早起来感受这份独特的震撼，那种历史与现代交融的感觉，会让你对这座城市有全新的认识。`,

  '摄影师眼中的天安门四季': `春夏秋冬，每个季节的天安门都有不同的美，让我带你发现这些美丽。

作为一名摄影师，我用镜头记录了天安门广场四季的变化，每个季节都有其独特的美丽和魅力。

春天的天安门，万物复苏。广场周围的柳絮飞舞，给庄严的建筑增添了一份柔美。最佳拍摄时间是清晨和傍晚，柔和的光线让整个广场显得温暖而有活力。

夏日的天安门，绿意盎然。蓝天白云下的红墙黄瓦格外醒目，这时候可以拍到色彩对比强烈的作品。建议使用偏振镜来突出天空的层次感。

秋季的天安门，金桂飘香。周围的银杏叶黄了，为庄重的广场增添了温暖的色调。这是我最喜欢的拍摄季节，金黄色的叶子与红色的宫墙形成完美的色彩搭配。

冬日的天安门，雪花纷飞。雪后的广场别有一番韵味，白雪覆盖下的建筑显得更加纯净和神圣。雪景拍摄要注意曝光补偿，避免画面过暗。

每个季节都有最佳的拍摄时机和技巧，希望能帮助更多摄影爱好者记录下这座城市的美好瞬间。`,

  '天安门广场的隐秘角落': `作为本地人，我知道一些游客不知道的拍照好位置和有趣的小细节。

在天安门广场这样一个知名景点，大多数游客都会去那些标志性的位置拍照。但作为一个在这里生活了30多年的老北京，我想和大家分享一些隐藏的拍摄角度和有趣的细节。

首先是观景台的最佳位置。很多人不知道，在广场东南角有一个略微高起的平台，从这里可以拍到整个广场的全景，而且人流相对较少。特别是在傍晚时分，夕阳西下的时候，从这个角度拍摄的照片特别有层次感。

其次是建筑细节的发现。天安门城楼上的每一个细节都有其历史意义，比如那些精美的彩绘、雕刻，都值得用镜头记录下来。我经常用长焦镜头来拍摄这些细节，展现古代工匠的精湛技艺。

还有一些有趣的人文瞬间。清晨时分，会有很多大爷大妈在广场上晨练，他们的身影与古老的建筑形成了有趣的对比。这些生活化的场景往往能拍出很有故事性的照片。

最后想说的是，拍摄不仅仅是记录美景，更重要的是感受这里的历史和文化。每一次按下快门，都是在记录一个时代的印记。`
};

// 默认附加图片
export const DEFAULT_ADDITIONAL_IMAGES = [
  'https://images.unsplash.com/photo-1622034094192-60e76098c96d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5c2NhcGUlMjB1cmJhbiUyMHRyYXZlbHxlbnwxfHx8fDE3NTgzNzk0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1737735356104-ef0037705756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGluZXNlJTIwYXJjaGl0ZWN0dXJlJTIwdGVtcGxlJTIwY3VsdHVyZXxlbnwxfHx8fDE3NTg0NDUyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1599486503843-c9a5e92d18ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBjaGluZXNlfGVufDF8fHx8MTc1ODM3OTQ4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
];

// 生成文章内容
export const generateArticleContent = (article) => {
  return ARTICLE_CONTENTS[article.title] || article.preview + '\n\n这里有更多精彩内容等待发现...';
};