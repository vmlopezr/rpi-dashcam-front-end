(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{L6id:function(e,n,t){"use strict";t.r(n);var l=t("8Y7J");class o{}var u=t("pMnS"),r=t("oBZk"),c=t("ZZ/e"),i=t("iInd"),s=t("SVse"),m=t("s7LF"),a=t("mrSG"),d=t("EnSQ"),b=t("+tLe");class g{constructor(e,n,t,l){this.http=e,this.dataService=n,this.alertController=t,this.modalController=l}ngOnInit(){this.showSpinner=!0,this.theme=this.dataService.getTheme(),this.isRecording=this.dataService.getIsRecording(),this.camList=["Microsoft LifeCam HD-3000","Logitech Webcam HD C920","Default UVC Camera"],this.setCameraImage(this.isRecording)}updateTheme(){"sunny"===this.theme?(this.theme="moon",this.setLightTheme()):(this.theme="sunny",this.setDarkTheme())}setDarkTheme(){document.documentElement.style.setProperty("--background-color","#181818"),document.documentElement.style.setProperty("--header-color","#0b151db9"),document.documentElement.style.setProperty("--toggle-background","#646464"),document.documentElement.style.setProperty("--toggle-background-checked","#1ab474"),document.documentElement.style.setProperty("--knob-bg","#979797"),document.documentElement.style.setProperty("--range-background-disabled","#838383"),document.documentElement.style.setProperty("--range-background","#0c0c0c75"),document.documentElement.style.setProperty("--range-background-active","#1480fba2"),document.documentElement.style.setProperty("--input-background","#0c0c0c75"),document.documentElement.style.setProperty("--input-border-color","transparent"),document.documentElement.style.setProperty("--heading-font-color","#d4d4d4"),document.documentElement.style.setProperty("--font-color","#c5c5c5"),document.documentElement.style.setProperty("--control-section-bg","#353333"),document.documentElement.style.setProperty("--control-section-border","#4b4b4b"),document.documentElement.style.setProperty("--button-bg","#1480fba2"),document.documentElement.style.setProperty("--button-bg-hover","#1480fb6e"),document.documentElement.style.setProperty("--button-bg-activated","#568bc0b2"),document.documentElement.style.setProperty("--button-color","#d8dde2"),document.documentElement.style.setProperty("--video-bg-options","#424242"),document.documentElement.style.setProperty("--menu-label-hover-bg","#838383"),document.documentElement.style.setProperty("--font-hover","#4b4b4b"),document.documentElement.style.setProperty("--image-background","#858080"),document.documentElement.style.setProperty("--table-header","#3a3535"),document.documentElement.style.setProperty("--table-row-bg","#5e5d5d")}setLightTheme(){document.documentElement.style.setProperty("--background-color","#ebebeb"),document.documentElement.style.setProperty("--header-color","#758797"),document.documentElement.style.setProperty("--control-section-bg","#fff"),document.documentElement.style.setProperty("--toggle-background","#bebebe"),document.documentElement.style.setProperty("--toggle-background-checked","#1aafb4"),document.documentElement.style.setProperty("--range-background-disabled","#7e7e7e"),document.documentElement.style.setProperty("--range-background","#b7e9eb"),document.documentElement.style.setProperty("--range-background-active","#147efb"),document.documentElement.style.setProperty("--input-background","#fff"),document.documentElement.style.setProperty("--input-border-color","#494949"),document.documentElement.style.setProperty("--heading-font-color","#252525"),document.documentElement.style.setProperty("--font-color","#494949"),document.documentElement.style.setProperty("--button-bg","#147efb"),document.documentElement.style.setProperty("--button-bg-hover","#1480fb5d"),document.documentElement.style.setProperty("--button-bg-activated","#1480fb5d"),document.documentElement.style.setProperty("--button-color","#fff"),document.documentElement.style.setProperty("--control-section-border","#9f9f9f"),document.documentElement.style.setProperty("--knob-bg","#ababab"),document.documentElement.style.setProperty("--video-bg-options","#fff"),document.documentElement.style.setProperty("--menu-label-hover-bg","#d3d3d3"),document.documentElement.style.setProperty("--image-background","#ebebeb"),document.documentElement.style.setProperty("--table-header","#aaa"),document.documentElement.style.setProperty("--table-row-bg","#fff")}ionViewWillLeave(){}ionViewWillEnter(){const e=this.dataService.getConfigData();this.camera=e.camera,setTimeout(()=>{this.showSpinner=!1,this.camImage=this.setCameraImage(this.isRecording)},500)}startRecording(){this.isRecording=!0,this.camImage="assets/CamOn/".concat(this.camera,"-on.png")}stopRecording(){this.isRecording=!1,this.dataService.setIsRecording(!1),this.camImage="assets/CamOff/".concat(this.camera,"-off.png")}showErrorLog(){return a.b(this,void 0,void 0,(function*(){const e=yield this.modalController.create({component:b.a,cssClass:"my-modal"});return yield e.present()}))}setCameraImage(e){return this.isRecording?"assets/CamOn/".concat(this.camera,"-on.png"):"assets/CamOff/".concat(this.camera,"-off.png")}selectionChange(){this.camImage=this.setCameraImage(this.isRecording),this.dataService.updateCamera(this.camera),this.showSpinner||this.dataService.retrieveCamDataFromDB(this.camera)}startStreamServer(){this.isRecording&&this.dataService.getConfigData()}shutDownConfirm(){return a.b(this,void 0,void 0,(function*(){const e=yield this.alertController.create({mode:"ios",header:"Warning",message:"RaspberryPi will shutdown. Are you sure?",cssClass:"custom-alert",buttons:[{text:"Cancel",role:"cancel"},{text:"Shutdown",handler:()=>{this.shutDown()}}]});yield e.present()}))}shutDown(){}}var p=t("IheW"),h=l.zb({encapsulation:0,styles:[[".home-back[_ngcontent-%COMP%], ion-icon[_ngcontent-%COMP%]{color:#fff}ion-img[_ngcontent-%COMP%]{display:block;margin:20px auto;width:300px;height:auto}"]],data:{}});function y(e){return l.Sb(0,[(e()(),l.Bb(0,0,null,null,2,"ion-select-option",[],null,null,null,r.M,r.q)),l.Ab(1,49152,null,0,c.ob,[l.j,l.p,l.F],{value:[0,"value"]},null),(e()(),l.Rb(2,0,[""," "]))],(function(e,n){e(n,1,0,l.Fb(1,"",n.context.$implicit,""))}),(function(e,n){e(n,2,0,n.context.$implicit)}))}function f(e){return l.Sb(0,[(e()(),l.Bb(0,0,null,null,1,"ion-spinner",[],null,null,null,r.O,r.r)),l.Ab(1,49152,null,0,c.sb,[l.j,l.p,l.F],null,null)],null,null)}function k(e){return l.Sb(0,[(e()(),l.Bb(0,0,null,null,1,"ion-img",[],null,null,null,r.G,r.j)),l.Ab(1,49152,null,0,c.D,[l.j,l.p,l.F],{src:[0,"src"]},null)],(function(e,n){e(n,1,0,n.component.camImage)}),null)}function E(e){return l.Sb(0,[(e()(),l.Bb(0,0,null,null,12,"ion-header",[],null,null,null,r.E,r.h)),l.Ab(1,49152,null,0,c.B,[l.j,l.p,l.F],null,null),(e()(),l.Bb(2,0,null,0,10,"ion-toolbar",[["color","primary"],["mode","ios"]],null,null,null,r.S,r.v)),l.Ab(3,49152,null,0,c.Cb,[l.j,l.p,l.F],{color:[0,"color"],mode:[1,"mode"]},null),(e()(),l.Bb(4,0,null,0,5,"ion-buttons",[["slot","end"]],null,null,null,r.A,r.d)),l.Ab(5,49152,null,0,c.l,[l.j,l.p,l.F],null,null),(e()(),l.Bb(6,0,null,0,3,"ion-button",[["fill","clear"]],null,[[null,"click"]],(function(e,n,t){var l=!0;return"click"===n&&(l=!1!==e.component.updateTheme()&&l),l}),r.z,r.c)),l.Ab(7,49152,null,0,c.k,[l.j,l.p,l.F],{fill:[0,"fill"]},null),(e()(),l.Bb(8,0,null,0,1,"ion-icon",[["slot","icon-only"]],null,null,null,r.F,r.i)),l.Ab(9,49152,null,0,c.C,[l.j,l.p,l.F],{name:[0,"name"]},null),(e()(),l.Bb(10,0,null,0,2,"ion-title",[],null,null,null,r.Q,r.t)),l.Ab(11,49152,null,0,c.Ab,[l.j,l.p,l.F],null,null),(e()(),l.Rb(-1,0,[" Pi Dashcam "])),(e()(),l.Bb(13,0,null,null,43,"ion-content",[],null,null,null,r.C,r.f)),l.Ab(14,49152,null,0,c.u,[l.j,l.p,l.F],null,null),(e()(),l.Bb(15,0,null,0,19,"div",[["class","buttonContainer"]],null,null,null,null,null)),(e()(),l.Bb(16,0,null,null,4,"ion-button",[["mode","ios"],["routerDirection","root"],["routerLink","/video-list"]],null,[[null,"click"]],(function(e,n,t){var o=!0;return"click"===n&&(o=!1!==l.Nb(e,18).onClick()&&o),"click"===n&&(o=!1!==l.Nb(e,19).onClick(t)&&o),o}),r.z,r.c)),l.Ab(17,49152,null,0,c.k,[l.j,l.p,l.F],{mode:[0,"mode"],routerDirection:[1,"routerDirection"]},null),l.Ab(18,16384,null,0,i.n,[i.m,i.a,[8,null],l.K,l.p],{routerLink:[0,"routerLink"]},null),l.Ab(19,737280,null,0,c.Jb,[s.g,c.Gb,l.p,i.m,[2,i.n]],{routerDirection:[0,"routerDirection"]},null),(e()(),l.Rb(-1,0,[" View Videos "])),(e()(),l.Bb(21,0,null,null,4,"ion-button",[["mode","ios"],["routerDirection","root"],["routerLink","/live-stream"]],null,[[null,"click"]],(function(e,n,t){var o=!0,u=e.component;return"click"===n&&(o=!1!==l.Nb(e,23).onClick()&&o),"click"===n&&(o=!1!==l.Nb(e,24).onClick(t)&&o),"click"===n&&(o=!1!==u.startStreamServer()&&o),o}),r.z,r.c)),l.Ab(22,49152,null,0,c.k,[l.j,l.p,l.F],{mode:[0,"mode"],routerDirection:[1,"routerDirection"]},null),l.Ab(23,16384,null,0,i.n,[i.m,i.a,[8,null],l.K,l.p],{routerLink:[0,"routerLink"]},null),l.Ab(24,737280,null,0,c.Jb,[s.g,c.Gb,l.p,i.m,[2,i.n]],{routerDirection:[0,"routerDirection"]},null),(e()(),l.Rb(-1,0,[" View Livestream "])),(e()(),l.Bb(26,0,null,null,2,"ion-button",[["mode","ios"]],null,[[null,"click"]],(function(e,n,t){var l=!0;return"click"===n&&(l=!1!==e.component.startRecording()&&l),l}),r.z,r.c)),l.Ab(27,49152,null,0,c.k,[l.j,l.p,l.F],{disabled:[0,"disabled"],mode:[1,"mode"]},null),(e()(),l.Rb(-1,0,[" Start Recording "])),(e()(),l.Bb(29,0,null,null,2,"ion-button",[["mode","ios"]],null,[[null,"click"]],(function(e,n,t){var l=!0;return"click"===n&&(l=!1!==e.component.stopRecording()&&l),l}),r.z,r.c)),l.Ab(30,49152,null,0,c.k,[l.j,l.p,l.F],{disabled:[0,"disabled"],mode:[1,"mode"]},null),(e()(),l.Rb(-1,0,[" Stop Recording "])),(e()(),l.Bb(32,0,null,null,2,"ion-button",[["mode","ios"]],null,[[null,"click"]],(function(e,n,t){var l=!0;return"click"===n&&(l=!1!==e.component.showErrorLog()&&l),l}),r.z,r.c)),l.Ab(33,49152,null,0,c.k,[l.j,l.p,l.F],{mode:[0,"mode"]},null),(e()(),l.Rb(-1,0,[" Error Log "])),(e()(),l.Bb(35,0,null,0,13,"ion-item",[["class","cam-select"]],null,null,null,r.I,r.l)),l.Ab(36,49152,null,0,c.H,[l.j,l.p,l.F],null,null),(e()(),l.Bb(37,0,null,0,2,"ion-label",[],null,null,null,r.J,r.m)),l.Ab(38,49152,null,0,c.N,[l.j,l.p,l.F],null,null),(e()(),l.Rb(-1,0,["Webcam"])),(e()(),l.Bb(40,0,null,0,8,"ion-select",[["mode","ios"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionChange"],[null,"ionBlur"]],(function(e,n,t){var o=!0,u=e.component;return"ionBlur"===n&&(o=!1!==l.Nb(e,41)._handleBlurEvent(t.target)&&o),"ionChange"===n&&(o=!1!==l.Nb(e,41)._handleChangeEvent(t.target)&&o),"ngModelChange"===n&&(o=!1!==(u.camera=t)&&o),"ionChange"===n&&(o=!1!==u.selectionChange()&&o),o}),r.N,r.p)),l.Ab(41,16384,null,0,c.Kb,[l.p],null,null),l.Ob(1024,null,m.b,(function(e){return[e]}),[c.Kb]),l.Ab(43,671744,null,0,m.e,[[8,null],[8,null],[8,null],[6,m.b]],{isDisabled:[0,"isDisabled"],model:[1,"model"]},{update:"ngModelChange"}),l.Ob(2048,null,m.c,null,[m.e]),l.Ab(45,16384,null,0,m.d,[[4,m.c]],null,null),l.Ab(46,49152,null,0,c.nb,[l.j,l.p,l.F],{disabled:[0,"disabled"],mode:[1,"mode"]},null),(e()(),l.qb(16777216,null,0,1,null,y)),l.Ab(48,278528,null,0,s.h,[l.W,l.S,l.x],{ngForOf:[0,"ngForOf"]},null),(e()(),l.Bb(49,0,null,0,4,"div",[["class","camera-image-container"]],null,null,null,null,null)),(e()(),l.qb(16777216,null,null,1,null,f)),l.Ab(51,16384,null,0,s.i,[l.W,l.S],{ngIf:[0,"ngIf"]},null),(e()(),l.qb(16777216,null,null,1,null,k)),l.Ab(53,16384,null,0,s.i,[l.W,l.S],{ngIf:[0,"ngIf"]},null),(e()(),l.Bb(54,0,null,0,2,"ion-button",[["class","shutdown-button"],["mode","ios"]],null,[[null,"click"]],(function(e,n,t){var l=!0;return"click"===n&&(l=!1!==e.component.shutDownConfirm()&&l),l}),r.z,r.c)),l.Ab(55,49152,null,0,c.k,[l.j,l.p,l.F],{mode:[0,"mode"]},null),(e()(),l.Rb(-1,0,[" Shutdown "]))],(function(e,n){var t=n.component;e(n,3,0,"primary","ios"),e(n,7,0,"clear"),e(n,9,0,l.Fb(1,"",t.theme,"")),e(n,17,0,"ios","root"),e(n,18,0,"/video-list"),e(n,19,0,"root"),e(n,22,0,"ios","root"),e(n,23,0,"/live-stream"),e(n,24,0,"root"),e(n,27,0,t.isRecording,"ios"),e(n,30,0,!t.isRecording,"ios"),e(n,33,0,"ios"),e(n,43,0,l.Fb(1,"",t.isRecording,""),t.camera),e(n,46,0,l.Fb(1,"",t.isRecording,""),"ios"),e(n,48,0,t.camList),e(n,51,0,t.showSpinner),e(n,53,0,!t.showSpinner),e(n,55,0,"ios")}),(function(e,n){e(n,40,0,l.Nb(n,45).ngClassUntouched,l.Nb(n,45).ngClassTouched,l.Nb(n,45).ngClassPristine,l.Nb(n,45).ngClassDirty,l.Nb(n,45).ngClassValid,l.Nb(n,45).ngClassInvalid,l.Nb(n,45).ngClassPending)}))}var v=l.xb("app-home",g,(function(e){return l.Sb(0,[(e()(),l.Bb(0,0,null,null,1,"app-home",[],null,null,null,E,h)),l.Ab(1,114688,null,0,g,[p.c,d.a,c.a,c.Fb],null,null)],(function(e,n){e(n,1,0)}),null)}),{},{},[]);t.d(n,"HomePageModuleNgFactory",(function(){return P}));var P=l.yb(o,[],(function(e){return l.Kb([l.Lb(512,l.m,l.jb,[[8,[u.a,v]],[3,l.m],l.D]),l.Lb(4608,s.k,s.j,[l.z,[2,s.q]]),l.Lb(4608,m.g,m.g,[]),l.Lb(4608,c.b,c.b,[l.F,l.g]),l.Lb(4608,c.Fb,c.Fb,[c.b,l.m,l.w]),l.Lb(4608,c.Ib,c.Ib,[c.b,l.m,l.w]),l.Lb(1073742336,s.b,s.b,[]),l.Lb(1073742336,m.f,m.f,[]),l.Lb(1073742336,m.a,m.a,[]),l.Lb(1073742336,c.Eb,c.Eb,[]),l.Lb(1073742336,i.o,i.o,[[2,i.t],[2,i.m]]),l.Lb(1073742336,o,o,[]),l.Lb(1024,i.k,(function(){return[[{path:"",component:g}]]}),[])])}))}}]);