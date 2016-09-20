 var myChart = echarts.init(document.getElementById('main'));
 // var myChart2 = echarts.init(document.getElementById('view2'));
 var option = {
     title: {
         text: 'web 技能图谱',
         subtext: 'by daisyHawen',
         x: 'right',
         y: 'bottom'
     },
     tooltip: {
         trigger: 'item',
         formatter: '{a} : {b}'
     },
     toolbox: {
         show: true,
         feature: {
             restore: {
                 show: true
             },
             magicType: {
                 show: true,
                 type: ['force', 'chord']
             },
             saveAsImage: {
                 show: true
             }
         }
     },
     legend: {
         x: 'left',
         data: ['Javascript', 'css',
             '前端自动化', 'nodejs', 'html'
         ]
     },
     series: [{
         type: 'force',
         name: "关系",
         ribbonType: false,
         categories: [{
             name: 'Javascript'
         }, {
             name: 'css'
         }, {
             name: '前端自动化'
         }, {
             name: 'nodejs'
         }, {
             name: 'html'
         }],
         itemStyle: {
             normal: {
                 label: {
                     show: true,
                     textStyle: {
                         color: '#333'
                     }
                 },
                 nodeStyle: {
                     brushType: 'both',
                     borderColor: 'rgba(255,215,0,0.4)',
                     borderWidth: 1
                 },
                 linkStyle: {
                     type: 'curve'
                 }
             },
             emphasis: {
                 label: {
                     show: false
                         // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                 },
                 nodeStyle: {
                     //r: 30
                 },
                 linkStyle: {}
             }
         },
         useWorker: false,
         minRadius: 15,
         maxRadius: 25,
         gravity: 1.1,
         scaling: 1.1,
         roam: 'move',
         nodes: [{
             category: 0,
             name: 'javascript',
             value: 10,
             label: 'javascript\n（主要）'
         }, {
             category: 0,
             name: 'vue.js',
             value: 3
         }, {
             category: 0,
             name: 'jquery',
             value: 2
         }, {
             category: 0,
             name: 'react.js',
             value: 7
         }, {
             category: 1,
             name: 'css',
             value: 9
         }, {
             category: 1,
             name: 'sass',
             value: 4
         }, {
             category: 1,
             name: 'compass',
             value: 4
         }, {
             category: 2,
             name: 'gulp',
             value: 5
         }, {
             category: 2,
             name: 'webpack',
             value: 8
         }, {
             category: 3,
             name: 'nodejs',
             value: 3
         }, {
             category: 3,
             name: 'express',
             value: 1
         }, {
             category: 4,
             name: 'HTML5',
             value: 1
         }, {
             category: 4,
             name: 'Canvas',
             value: 1
         }, {
             category: 4,
             name: 'SVG',
             value: 1
         }],
         links: [{
             source: 'jquery',
             target: 'javascript',
             weight: 2,
             name: '框架'
         }, {
             source: 'react',
             target: 'javascript',
             weight: 2,
             name: '框架'
         }, {
             source: 'react.js',
             target: 'javascript',
             weight: 1,
             name: '框架'
         }, {
             source: 'vue.js',
             target: 'javascript',
             weight: 2,
             name: '框架'
         }, {
             source: 'sass',
             target: 'css',
             weight: 3,
             name: ''
         }, {
             source: 'compass',
             target: 'css',
             weight: 6,
             name: ''
         }, {
             source: 'gulp',
             target: 'css',
             weight: 2,
             name: '工具'
         }, {
             source: 'gulp',
             target: 'nodejs',
             weight: 2,
             name: '工具'
         }, {
             source: 'nodejs',
             target: 'javascript',
             weight: 1,
             name: ''
         }, {
             source: 'nodejs',
             target: 'javascript',
             weight: 1,
             name: '服务端语言'
         }, {
             source: 'HTML5',
             target: 'javascript',
             weight: 1,
         }, {
             source: 'css',
             target: 'javascript',
             weight: 1,
         }, {
             source: 'express',
             target: 'nodejs',
             weight: 1,
             name: ''
         }, {
             source: 'webpack',
             target: 'nodejs',
             weight: 1,
             name: '工具'
         }, {
             source: 'SVG',
             target: 'HTML5',
             weight: 1
         }, {
             source: 'Canvas',
             target: 'HTML5',
             weight: 1
         }, {
             source: 'vue.js',
             target: 'javascript',
             weight: 1
         }, {
             source: 'gulp',
             target: 'webpack',
             weight: 1,
         }, {
             source: 'css',
             target: 'HTML5',
             weight: 1,
             name: '样式'
         }]
     }]
 };

 myChart.setOption(option);