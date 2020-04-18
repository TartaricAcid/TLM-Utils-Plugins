export var openWikiUrl = new Action('open_wiki_url', {
    name: '打开 wiki 页面',
    description: '打开车万女仆模组的 wiki 界面',
    icon: 'fa-book',
    click: function () {
        Blockbench.openLink("https://tlmwiki.cfpa.team/");
    }
});

export var openMcbbsUrl = new Action('open_mcbbs_url', {
    name: '打开模型发布页面',
    description: '打开 MCBBS 的模型发布界面',
    icon: 'fa-swatchbook',
    click: function () {
        Blockbench.openLink("https://www.mcbbs.net/thread-1015497-1-1.html");
    }
});