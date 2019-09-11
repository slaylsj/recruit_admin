import ApplyList from "../../containers/ApplyList";
import RecruitMgmt from "../../containers/RecruitMgmt";
import RecruitWrite from "../../containers/RecruitWrite";
import RecruitModify from "../../containers/RecruitModify";
import RecruitQnaMgmt from "../../containers/RecruitQnaMgmt";

var sideMenus = [
    {
        path: "/appList",
        name: "지원서 조회",
        icon: "vcard",
        id : 100,
        child: []
    },
    {
        path: "/",
        name: "채용공고관리",
        icon: "group",
        id : 200,
        child: [
            {
                path: "/recruitMgmt",
                name: "공고 관리",
                icon: "",
                component: RecruitMgmt,
                id : 210
            },
            {
                path: "/recruitWrite",
                name: "공고 등록",
                icon: "",
                component: RecruitWrite,
                id : 220
            }
        ]
    },
    {
        path: "/recruitQnaMgmt",
        name: "Q&A 관리",
        icon: "question circle outline",
        id : 300,
        child: []
    }
];

var menuRoutes = [
    {
        path: "/appList",
        exact: false,
        component: ApplyList
    },
    {
        path: "/recruitMgmt",
        exact: false,
        component: RecruitMgmt
    },
    {
        path: "/recruitWrite",
        exact: true,
        component: RecruitWrite
    },
    {
        path: "/recruitModify/:recruitID",
        exact: false,
        component: RecruitModify
    },
    {
        path: "/recruitQnaMgmt",
        exact: false,
        component: RecruitQnaMgmt
    },
    { 
        redirect: true, 
        path: "/", 
        pathTo: "/index"
    }
];

export {
    sideMenus,
    menuRoutes
}