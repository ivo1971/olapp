/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */

import * as import0 from '../../../../../src/app/routes/simple-button/simple-button.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import2 from '@angular/core/src/render/api';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../../../src/app/services/img-base64.service';
import * as import9 from '../../../../../src/app/services/log.service';
import * as import10 from '../../../../../src/app/services/mode.service';
import * as import11 from '../../../../../src/app/services/teams-users.service';
import * as import12 from '../../../../../src/app/services/user.service';
import * as import13 from '../../../../../src/app/services/websocket.user.service';
import * as import14 from './simple-button.component.css.shim.ngstyle';
import * as import15 from '../../../../../src/app/components/image-local/image-local.component';
import * as import16 from '../../components/image-local/image-local.component.ngfactory';
import * as import17 from '@angular/core/src/linker/view_container';
import * as import18 from '../../../../../src/app/services/cloud.service';
import * as import19 from '../../../../../src/app/components/scoreboard-list/scoreboard-list.component';
import * as import20 from '../../components/scoreboard-list/scoreboard-list.component.ngfactory';
import * as import21 from '@angular/common/src/pipes/async_pipe';
import * as import22 from '../../../../../src/app/routes/simple-button/simple-button.pipe';
import * as import23 from '@angular/core/src/change_detection/change_detection_util';
import * as import24 from '@angular/core/src/security';
import * as import25 from '../../../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import26 from '@angular/core/src/linker/template_ref';
import * as import27 from '@angular/common/src/directives/ng_if';
import * as import28 from '../../../../../src/app/routes/simple-button/simple-button-data.component';
import * as import29 from './simple-button-data.component.ngfactory';
export class Wrapper_SimpleButtonComponent {
  /*private*/ _eventHandler:Function;
  context:import0.SimpleButtonComponent;
  /*private*/ _changed:boolean;
  constructor(p0:any,p1:any,p2:any,p3:any,p4:any,p5:any) {
    this._changed = false;
    this.context = new import0.SimpleButtonComponent(p0,p1,p2,p3,p4,p5);
  }
  ngOnDetach(view:import1.AppView<any>,componentView:import1.AppView<any>,el:any):void {
  }
  ngOnDestroy():void {
    this.context.ngOnDestroy();
  }
  ngDoCheck(view:import1.AppView<any>,el:any,throwOnChange:boolean):boolean {
    var changed:any = this._changed;
    this._changed = false;
    if (!throwOnChange) { if ((view.numberOfChecks === 0)) { this.context.ngOnInit(); } }
    return changed;
  }
  checkHost(view:import1.AppView<any>,componentView:import1.AppView<any>,el:any,throwOnChange:boolean):void {
  }
  handleEvent(eventName:string,$event:any):boolean {
    var result:boolean = true;
    return result;
  }
  subscribe(view:import1.AppView<any>,_eventHandler:any):void {
    this._eventHandler = _eventHandler;
  }
}
var renderType_SimpleButtonComponent_Host:import2.RenderComponentType = import3.createRenderComponentType('',0,import4.ViewEncapsulation.None,([] as any[]),{});
class View_SimpleButtonComponent_Host0 extends import1.AppView<any> {
  _el_0:any;
  compView_0:import1.AppView<import0.SimpleButtonComponent>;
  _SimpleButtonComponent_0_3:Wrapper_SimpleButtonComponent;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_SimpleButtonComponent_Host0,renderType_SimpleButtonComponent_Host,import5.ViewType.HOST,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer,'simple-button',import3.EMPTY_INLINE_ARRAY,rootSelector,(null as any));
    this.compView_0 = new View_SimpleButtonComponent0(this.viewUtils,this,0,this._el_0);
    this._SimpleButtonComponent_0_3 = new Wrapper_SimpleButtonComponent(this.injectorGet(import8.ImgBase64Service,this.parentIndex),this.injectorGet(import9.LogService,this.parentIndex),this.injectorGet(import10.ModeService,this.parentIndex),this.injectorGet(import11.TeamsUsersService,this.parentIndex),this.injectorGet(import12.UserService,this.parentIndex),this.injectorGet(import13.WebsocketUserService,this.parentIndex));
    this.compView_0.create(this._SimpleButtonComponent_0_3.context);
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return new import7.ComponentRef_<any>(0,this,this._el_0,this._SimpleButtonComponent_0_3.context);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import0.SimpleButtonComponent) && (0 === requestNodeIndex))) { return this._SimpleButtonComponent_0_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this._SimpleButtonComponent_0_3.ngDoCheck(this,this._el_0,throwOnChange);
    this.compView_0.internalDetectChanges(throwOnChange);
  }
  destroyInternal():void {
    this.compView_0.destroy();
    this._SimpleButtonComponent_0_3.ngOnDestroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
export const SimpleButtonComponentNgFactory:import7.ComponentFactory<import0.SimpleButtonComponent> = new import7.ComponentFactory<import0.SimpleButtonComponent>('simple-button',View_SimpleButtonComponent_Host0,import0.SimpleButtonComponent);
const styles_SimpleButtonComponent:any[] = [import14.styles];
class View_SimpleButtonComponent1 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  _el_2:any;
  compView_2:import1.AppView<import15.ImageLocalComponent>;
  _ImageLocalComponent_2_3:import16.Wrapper_ImageLocalComponent;
  _text_3:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent1,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'span',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'\n        ',(null as any));
    this._el_2 = import3.createRenderElement(this.renderer,this._el_0,'image-local',new import3.InlineArray4(4,'height','150','source','loading.gif'),(null as any));
    this.compView_2 = new import16.View_ImageLocalComponent0(this.viewUtils,this,2,this._el_2);
    this._ImageLocalComponent_2_3 = new import16.Wrapper_ImageLocalComponent(this.parentView.parentView.injectorGet(import18.CloudService,this.parentView.parentIndex));
    this.compView_2.create(this._ImageLocalComponent_2_3.context);
    this._text_3 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._el_2,
      this._text_3
    ]
    ),(null as any));
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import15.ImageLocalComponent) && (2 === requestNodeIndex))) { return this._ImageLocalComponent_2_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_2_0_0:any = 'loading.gif';
    this._ImageLocalComponent_2_3.check_source(currVal_2_0_0,throwOnChange,false);
    const currVal_2_0_1:any = '150';
    this._ImageLocalComponent_2_3.check_height(currVal_2_0_1,throwOnChange,false);
    this._ImageLocalComponent_2_3.ngDoCheck(this,this._el_2,throwOnChange);
    this.compView_2.internalDetectChanges(throwOnChange);
  }
  destroyInternal():void {
    this.compView_2.destroy();
    this._ImageLocalComponent_2_3.ngOnDestroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
class View_SimpleButtonComponent3 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  _el_2:any;
  compView_2:import1.AppView<import19.ScoreboardListComponent>;
  _ScoreboardListComponent_2_3:import20.Wrapper_ScoreboardListComponent;
  _text_3:any;
  _pipe_async_0:import21.AsyncPipe;
  _pipe_simpleButtonTeamPointsSort_1:import22.SimpleButtonTeamPointsSort;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent3,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'span',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'\n            ',(null as any));
    this._el_2 = import3.createRenderElement(this.renderer,this._el_0,'scoreboard-list',import3.EMPTY_INLINE_ARRAY,(null as any));
    this.compView_2 = new import20.View_ScoreboardListComponent0(this.viewUtils,this,2,this._el_2);
    this._ScoreboardListComponent_2_3 = new import20.Wrapper_ScoreboardListComponent();
    this.compView_2.create(this._ScoreboardListComponent_2_3.context);
    this._text_3 = this.renderer.createText(this._el_0,'\n        ',(null as any));
    this._pipe_async_0 = new import21.AsyncPipe(this.parentView.parentView.ref);
    this._pipe_simpleButtonTeamPointsSort_1 = new import22.SimpleButtonTeamPointsSort();
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._el_2,
      this._text_3
    ]
    ),(null as any));
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import19.ScoreboardListComponent) && (2 === requestNodeIndex))) { return this._ScoreboardListComponent_2_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const valUnwrapper:any = new import23.ValueUnwrapper();
    const currVal_2_0_0:any = 3;
    this._ScoreboardListComponent_2_3.check_nbrPerRow(currVal_2_0_0,throwOnChange,false);
    const currVal_2_0_1:any = false;
    this._ScoreboardListComponent_2_3.check_total(currVal_2_0_1,throwOnChange,false);
    valUnwrapper.reset();
    const currVal_2_0_2:any = valUnwrapper.unwrap(this._pipe_simpleButtonTeamPointsSort_1.transform(valUnwrapper.unwrap(this._pipe_async_0.transform(this.parentView.parentView.context.observableTeamInfo)),false));
    this._ScoreboardListComponent_2_3.check_teamsInfo(currVal_2_0_2,throwOnChange,valUnwrapper.hasWrappedValue);
    this._ScoreboardListComponent_2_3.ngDoCheck(this,this._el_2,throwOnChange);
    this.compView_2.internalDetectChanges(throwOnChange);
  }
  destroyInternal():void {
    this.compView_2.destroy();
    this._pipe_async_0.ngOnDestroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
class View_SimpleButtonComponent5 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _expr_1:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent5,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
    this._expr_1 = import23.UNINITIALIZED;
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'img',new import3.InlineArray4(4,'alt','','height','150'),(null as any));
    var disposable_0:Function = import3.subscribeToRenderElement(this,this._el_0,new import3.InlineArray2(2,'click',(null as any)),this.eventHandler(this.handleEvent_0));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),[disposable_0]);
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_1:any = this.parentView.parentView.parentView.context.imgPush;
    if (import3.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementProperty(this._el_0,'src',this.viewUtils.sanitizer.sanitize(import24.SecurityContext.URL,currVal_1));
      this._expr_1 = currVal_1;
    }
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
  handleEvent_0(eventName:string,$event:any):boolean {
    this.markPathToRootAsCheckOnce();
    var result:boolean = true;
    if ((eventName == 'click')) {
      const pd_sub_0:any = ((<any>this.parentView.parentView.parentView.context.onPush()) !== false);
      result = (pd_sub_0 && result);
    }
    return result;
  }
}
class View_SimpleButtonComponent6 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _expr_1:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent6,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
    this._expr_1 = import23.UNINITIALIZED;
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'img',new import3.InlineArray4(4,'alt','','height','150'),(null as any));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_1:any = this.parentView.parentView.parentView.context.imgGood;
    if (import3.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementProperty(this._el_0,'src',this.viewUtils.sanitizer.sanitize(import24.SecurityContext.URL,currVal_1));
      this._expr_1 = currVal_1;
    }
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
class View_SimpleButtonComponent7 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _expr_1:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent7,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
    this._expr_1 = import23.UNINITIALIZED;
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'img',new import3.InlineArray4(4,'alt','','height','150'),(null as any));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_1:any = this.parentView.parentView.parentView.context.imgWrong;
    if (import3.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementProperty(this._el_0,'src',this.viewUtils.sanitizer.sanitize(import24.SecurityContext.URL,currVal_1));
      this._expr_1 = currVal_1;
    }
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
class View_SimpleButtonComponent8 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _expr_1:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent8,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
    this._expr_1 = import23.UNINITIALIZED;
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'img',new import3.InlineArray4(4,'alt','','height','150'),(null as any));
    var disposable_0:Function = import3.subscribeToRenderElement(this,this._el_0,new import3.InlineArray2(2,'click',(null as any)),this.eventHandler(this.handleEvent_0));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),[disposable_0]);
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_1:any = this.parentView.parentView.parentView.context.imgGo;
    if (import3.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementProperty(this._el_0,'src',this.viewUtils.sanitizer.sanitize(import24.SecurityContext.URL,currVal_1));
      this._expr_1 = currVal_1;
    }
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
  handleEvent_0(eventName:string,$event:any):boolean {
    this.markPathToRootAsCheckOnce();
    var result:boolean = true;
    if ((eventName == 'click')) {
      const pd_sub_0:any = ((<any>this.parentView.parentView.parentView.context.onPush()) !== false);
      result = (pd_sub_0 && result);
    }
    return result;
  }
}
class View_SimpleButtonComponent9 extends import1.AppView<any> {
  _el_0:any;
  /*private*/ _expr_1:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent9,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
    this._expr_1 = import23.UNINITIALIZED;
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'img',new import3.InlineArray4(4,'alt','','height','150'),(null as any));
    var disposable_0:Function = import3.subscribeToRenderElement(this,this._el_0,new import3.InlineArray2(2,'click',(null as any)),this.eventHandler(this.handleEvent_0));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),[disposable_0]);
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_1:any = this.parentView.parentView.parentView.context.imgWait;
    if (import3.checkBinding(throwOnChange,this._expr_1,currVal_1)) {
      this.renderer.setElementProperty(this._el_0,'src',this.viewUtils.sanitizer.sanitize(import24.SecurityContext.URL,currVal_1));
      this._expr_1 = currVal_1;
    }
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
  handleEvent_0(eventName:string,$event:any):boolean {
    this.markPathToRootAsCheckOnce();
    var result:boolean = true;
    if ((eventName == 'click')) {
      const pd_sub_0:any = ((<any>this.parentView.parentView.parentView.context.onPush()) !== false);
      result = (pd_sub_0 && result);
    }
    return result;
  }
}
class View_SimpleButtonComponent4 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  _anchor_2:any;
  /*private*/ _vc_2:import17.ViewContainer;
  _TemplateRef_2_5:any;
  _NgIf_2_6:import25.Wrapper_NgIf;
  _text_3:any;
  _anchor_4:any;
  /*private*/ _vc_4:import17.ViewContainer;
  _TemplateRef_4_5:any;
  _NgIf_4_6:import25.Wrapper_NgIf;
  _text_5:any;
  _anchor_6:any;
  /*private*/ _vc_6:import17.ViewContainer;
  _TemplateRef_6_5:any;
  _NgIf_6_6:import25.Wrapper_NgIf;
  _text_7:any;
  _anchor_8:any;
  /*private*/ _vc_8:import17.ViewContainer;
  _TemplateRef_8_5:any;
  _NgIf_8_6:import25.Wrapper_NgIf;
  _text_9:any;
  _anchor_10:any;
  /*private*/ _vc_10:import17.ViewContainer;
  _TemplateRef_10_5:any;
  _NgIf_10_6:import25.Wrapper_NgIf;
  _text_11:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent4,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'span',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'\n            ',(null as any));
    this._anchor_2 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_2 = new import17.ViewContainer(2,0,this,this._anchor_2);
    this._TemplateRef_2_5 = new import26.TemplateRef_(this,2,this._anchor_2);
    this._NgIf_2_6 = new import25.Wrapper_NgIf(this._vc_2.vcRef,this._TemplateRef_2_5);
    this._text_3 = this.renderer.createText(this._el_0,'\n            ',(null as any));
    this._anchor_4 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_4 = new import17.ViewContainer(4,0,this,this._anchor_4);
    this._TemplateRef_4_5 = new import26.TemplateRef_(this,4,this._anchor_4);
    this._NgIf_4_6 = new import25.Wrapper_NgIf(this._vc_4.vcRef,this._TemplateRef_4_5);
    this._text_5 = this.renderer.createText(this._el_0,'\n            ',(null as any));
    this._anchor_6 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_6 = new import17.ViewContainer(6,0,this,this._anchor_6);
    this._TemplateRef_6_5 = new import26.TemplateRef_(this,6,this._anchor_6);
    this._NgIf_6_6 = new import25.Wrapper_NgIf(this._vc_6.vcRef,this._TemplateRef_6_5);
    this._text_7 = this.renderer.createText(this._el_0,'\n            ',(null as any));
    this._anchor_8 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_8 = new import17.ViewContainer(8,0,this,this._anchor_8);
    this._TemplateRef_8_5 = new import26.TemplateRef_(this,8,this._anchor_8);
    this._NgIf_8_6 = new import25.Wrapper_NgIf(this._vc_8.vcRef,this._TemplateRef_8_5);
    this._text_9 = this.renderer.createText(this._el_0,'\n            ',(null as any));
    this._anchor_10 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_10 = new import17.ViewContainer(10,0,this,this._anchor_10);
    this._TemplateRef_10_5 = new import26.TemplateRef_(this,10,this._anchor_10);
    this._NgIf_10_6 = new import25.Wrapper_NgIf(this._vc_10.vcRef,this._TemplateRef_10_5);
    this._text_11 = this.renderer.createText(this._el_0,'\n        ',(null as any));
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._anchor_2,
      this._text_3,
      this._anchor_4,
      this._text_5,
      this._anchor_6,
      this._text_7,
      this._anchor_8,
      this._text_9,
      this._anchor_10,
      this._text_11
    ]
    ),(null as any));
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import26.TemplateRef) && (2 === requestNodeIndex))) { return this._TemplateRef_2_5; }
    if (((token === import27.NgIf) && (2 === requestNodeIndex))) { return this._NgIf_2_6.context; }
    if (((token === import26.TemplateRef) && (4 === requestNodeIndex))) { return this._TemplateRef_4_5; }
    if (((token === import27.NgIf) && (4 === requestNodeIndex))) { return this._NgIf_4_6.context; }
    if (((token === import26.TemplateRef) && (6 === requestNodeIndex))) { return this._TemplateRef_6_5; }
    if (((token === import27.NgIf) && (6 === requestNodeIndex))) { return this._NgIf_6_6.context; }
    if (((token === import26.TemplateRef) && (8 === requestNodeIndex))) { return this._TemplateRef_8_5; }
    if (((token === import27.NgIf) && (8 === requestNodeIndex))) { return this._NgIf_8_6.context; }
    if (((token === import26.TemplateRef) && (10 === requestNodeIndex))) { return this._TemplateRef_10_5; }
    if (((token === import27.NgIf) && (10 === requestNodeIndex))) { return this._NgIf_10_6.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_2_0_0:boolean = (((!this.parentView.parentView.context.wait && !this.parentView.parentView.context.go) && !this.parentView.parentView.context.wrong) && !this.parentView.parentView.context.good);
    this._NgIf_2_6.check_ngIf(currVal_2_0_0,throwOnChange,false);
    this._NgIf_2_6.ngDoCheck(this,this._anchor_2,throwOnChange);
    const currVal_4_0_0:any = this.parentView.parentView.context.good;
    this._NgIf_4_6.check_ngIf(currVal_4_0_0,throwOnChange,false);
    this._NgIf_4_6.ngDoCheck(this,this._anchor_4,throwOnChange);
    const currVal_6_0_0:any = this.parentView.parentView.context.wrong;
    this._NgIf_6_6.check_ngIf(currVal_6_0_0,throwOnChange,false);
    this._NgIf_6_6.ngDoCheck(this,this._anchor_6,throwOnChange);
    const currVal_8_0_0:any = this.parentView.parentView.context.go;
    this._NgIf_8_6.check_ngIf(currVal_8_0_0,throwOnChange,false);
    this._NgIf_8_6.ngDoCheck(this,this._anchor_8,throwOnChange);
    const currVal_10_0_0:any = this.parentView.parentView.context.wait;
    this._NgIf_10_6.check_ngIf(currVal_10_0_0,throwOnChange,false);
    this._NgIf_10_6.ngDoCheck(this,this._anchor_10,throwOnChange);
    this._vc_2.detectChangesInNestedViews(throwOnChange);
    this._vc_4.detectChangesInNestedViews(throwOnChange);
    this._vc_6.detectChangesInNestedViews(throwOnChange);
    this._vc_8.detectChangesInNestedViews(throwOnChange);
    this._vc_10.detectChangesInNestedViews(throwOnChange);
  }
  destroyInternal():void {
    this._vc_2.destroyNestedViews();
    this._vc_4.destroyNestedViews();
    this._vc_6.destroyNestedViews();
    this._vc_8.destroyNestedViews();
    this._vc_10.destroyNestedViews();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
  createEmbeddedViewInternal(nodeIndex:number):import1.AppView<any> {
    if ((nodeIndex == 2)) { return new View_SimpleButtonComponent5(this.viewUtils,this,2,this._anchor_2,this._vc_2); }
    if ((nodeIndex == 4)) { return new View_SimpleButtonComponent6(this.viewUtils,this,4,this._anchor_4,this._vc_4); }
    if ((nodeIndex == 6)) { return new View_SimpleButtonComponent7(this.viewUtils,this,6,this._anchor_6,this._vc_6); }
    if ((nodeIndex == 8)) { return new View_SimpleButtonComponent8(this.viewUtils,this,8,this._anchor_8,this._vc_8); }
    if ((nodeIndex == 10)) { return new View_SimpleButtonComponent9(this.viewUtils,this,10,this._anchor_10,this._vc_10); }
    return (null as any);
  }
}
class View_SimpleButtonComponent2 extends import1.AppView<any> {
  _el_0:any;
  _text_1:any;
  _anchor_2:any;
  /*private*/ _vc_2:import17.ViewContainer;
  _TemplateRef_2_5:any;
  _NgIf_2_6:import25.Wrapper_NgIf;
  _text_3:any;
  _anchor_4:any;
  /*private*/ _vc_4:import17.ViewContainer;
  _TemplateRef_4_5:any;
  _NgIf_4_6:import25.Wrapper_NgIf;
  _text_5:any;
  _el_6:any;
  _text_7:any;
  _el_8:any;
  compView_8:import1.AppView<import28.SimpleButtonComponentData>;
  _SimpleButtonComponentData_8_3:import29.Wrapper_SimpleButtonComponentData;
  _text_9:any;
  _text_10:any;
  _pipe_async_0:import21.AsyncPipe;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any,declaredViewContainer:import17.ViewContainer) {
    super(View_SimpleButtonComponent2,renderType_SimpleButtonComponent,import5.ViewType.EMBEDDED,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways,declaredViewContainer);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.createRenderElement(this.renderer,(null as any),'span',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'\n        ',(null as any));
    this._anchor_2 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_2 = new import17.ViewContainer(2,0,this,this._anchor_2);
    this._TemplateRef_2_5 = new import26.TemplateRef_(this,2,this._anchor_2);
    this._NgIf_2_6 = new import25.Wrapper_NgIf(this._vc_2.vcRef,this._TemplateRef_2_5);
    this._text_3 = this.renderer.createText(this._el_0,'\n        ',(null as any));
    this._anchor_4 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_4 = new import17.ViewContainer(4,0,this,this._anchor_4);
    this._TemplateRef_4_5 = new import26.TemplateRef_(this,4,this._anchor_4);
    this._NgIf_4_6 = new import25.Wrapper_NgIf(this._vc_4.vcRef,this._TemplateRef_4_5);
    this._text_5 = this.renderer.createText(this._el_0,'\n        ',(null as any));
    this._el_6 = import3.createRenderElement(this.renderer,this._el_0,'div',new import3.InlineArray2(2,'class','text-left'),(null as any));
    this._text_7 = this.renderer.createText(this._el_6,'\n            ',(null as any));
    this._el_8 = import3.createRenderElement(this.renderer,this._el_6,'simple-button-data',import3.EMPTY_INLINE_ARRAY,(null as any));
    this.compView_8 = new import29.View_SimpleButtonComponentData0(this.viewUtils,this,8,this._el_8);
    this._SimpleButtonComponentData_8_3 = new import29.Wrapper_SimpleButtonComponentData(this.parentView.parentView.injectorGet(import8.ImgBase64Service,this.parentView.parentIndex));
    this.compView_8.create(this._SimpleButtonComponentData_8_3.context);
    this._text_9 = this.renderer.createText(this._el_6,'\n        ',(null as any));
    this._text_10 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    this._pipe_async_0 = new import21.AsyncPipe(this.parentView.ref);
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._anchor_2,
      this._text_3,
      this._anchor_4,
      this._text_5,
      this._el_6,
      this._text_7,
      this._el_8,
      this._text_9,
      this._text_10
    ]
    ),(null as any));
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import26.TemplateRef) && (2 === requestNodeIndex))) { return this._TemplateRef_2_5; }
    if (((token === import27.NgIf) && (2 === requestNodeIndex))) { return this._NgIf_2_6.context; }
    if (((token === import26.TemplateRef) && (4 === requestNodeIndex))) { return this._TemplateRef_4_5; }
    if (((token === import27.NgIf) && (4 === requestNodeIndex))) { return this._NgIf_4_6.context; }
    if (((token === import28.SimpleButtonComponentData) && (8 === requestNodeIndex))) { return this._SimpleButtonComponentData_8_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const valUnwrapper:any = new import23.ValueUnwrapper();
    const currVal_2_0_0:any = (this.parentView.context.modeIsBeamer || this.parentView.context.modeIsMaster);
    this._NgIf_2_6.check_ngIf(currVal_2_0_0,throwOnChange,false);
    this._NgIf_2_6.ngDoCheck(this,this._anchor_2,throwOnChange);
    const currVal_4_0_0:any = this.parentView.context.modeIsQuiz;
    this._NgIf_4_6.check_ngIf(currVal_4_0_0,throwOnChange,false);
    this._NgIf_4_6.ngDoCheck(this,this._anchor_4,throwOnChange);
    valUnwrapper.reset();
    const currVal_8_0_0:any = valUnwrapper.unwrap(this._pipe_async_0.transform(this.parentView.context.observableInfo));
    this._SimpleButtonComponentData_8_3.check_data(currVal_8_0_0,throwOnChange,valUnwrapper.hasWrappedValue);
    this._SimpleButtonComponentData_8_3.ngDoCheck(this,this._el_8,throwOnChange);
    this._vc_2.detectChangesInNestedViews(throwOnChange);
    this._vc_4.detectChangesInNestedViews(throwOnChange);
    this.compView_8.internalDetectChanges(throwOnChange);
  }
  destroyInternal():void {
    this._vc_2.destroyNestedViews();
    this._vc_4.destroyNestedViews();
    this.compView_8.destroy();
    this._pipe_async_0.ngOnDestroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
  createEmbeddedViewInternal(nodeIndex:number):import1.AppView<any> {
    if ((nodeIndex == 2)) { return new View_SimpleButtonComponent3(this.viewUtils,this,2,this._anchor_2,this._vc_2); }
    if ((nodeIndex == 4)) { return new View_SimpleButtonComponent4(this.viewUtils,this,4,this._anchor_4,this._vc_4); }
    return (null as any);
  }
}
var renderType_SimpleButtonComponent:import2.RenderComponentType = import3.createRenderComponentType('',0,import4.ViewEncapsulation.Emulated,styles_SimpleButtonComponent,{});
export class View_SimpleButtonComponent0 extends import1.AppView<import0.SimpleButtonComponent> {
  _el_0:any;
  _text_1:any;
  _anchor_2:any;
  /*private*/ _vc_2:import17.ViewContainer;
  _TemplateRef_2_5:any;
  _NgIf_2_6:import25.Wrapper_NgIf;
  _text_3:any;
  _anchor_4:any;
  /*private*/ _vc_4:import17.ViewContainer;
  _TemplateRef_4_5:any;
  _NgIf_4_6:import25.Wrapper_NgIf;
  _text_5:any;
  _text_6:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_SimpleButtonComponent0,renderType_SimpleButtonComponent,import5.ViewType.COMPONENT,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    const parentRenderNode:any = this.renderer.createViewRoot(this.parentElement);
    this._el_0 = import3.createRenderElement(this.renderer,parentRenderNode,'div',new import3.InlineArray2(2,'class','text-center'),(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    this._anchor_2 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_2 = new import17.ViewContainer(2,0,this,this._anchor_2);
    this._TemplateRef_2_5 = new import26.TemplateRef_(this,2,this._anchor_2);
    this._NgIf_2_6 = new import25.Wrapper_NgIf(this._vc_2.vcRef,this._TemplateRef_2_5);
    this._text_3 = this.renderer.createText(this._el_0,'\n    ',(null as any));
    this._anchor_4 = this.renderer.createTemplateAnchor(this._el_0,(null as any));
    this._vc_4 = new import17.ViewContainer(4,0,this,this._anchor_4);
    this._TemplateRef_4_5 = new import26.TemplateRef_(this,4,this._anchor_4);
    this._NgIf_4_6 = new import25.Wrapper_NgIf(this._vc_4.vcRef,this._TemplateRef_4_5);
    this._text_5 = this.renderer.createText(this._el_0,'\n',(null as any));
    this._text_6 = this.renderer.createText(parentRenderNode,'\n',(null as any));
    this.init((null as any),((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._anchor_2,
      this._text_3,
      this._anchor_4,
      this._text_5,
      this._text_6
    ]
    ),(null as any));
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import26.TemplateRef) && (2 === requestNodeIndex))) { return this._TemplateRef_2_5; }
    if (((token === import27.NgIf) && (2 === requestNodeIndex))) { return this._NgIf_2_6.context; }
    if (((token === import26.TemplateRef) && (4 === requestNodeIndex))) { return this._TemplateRef_4_5; }
    if (((token === import27.NgIf) && (4 === requestNodeIndex))) { return this._NgIf_4_6.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const currVal_2_0_0:any = (this.context.prevSequenceNbr === 0);
    this._NgIf_2_6.check_ngIf(currVal_2_0_0,throwOnChange,false);
    this._NgIf_2_6.ngDoCheck(this,this._anchor_2,throwOnChange);
    const currVal_4_0_0:any = (this.context.prevSequenceNbr !== 0);
    this._NgIf_4_6.check_ngIf(currVal_4_0_0,throwOnChange,false);
    this._NgIf_4_6.ngDoCheck(this,this._anchor_4,throwOnChange);
    this._vc_2.detectChangesInNestedViews(throwOnChange);
    this._vc_4.detectChangesInNestedViews(throwOnChange);
  }
  destroyInternal():void {
    this._vc_2.destroyNestedViews();
    this._vc_4.destroyNestedViews();
  }
  createEmbeddedViewInternal(nodeIndex:number):import1.AppView<any> {
    if ((nodeIndex == 2)) { return new View_SimpleButtonComponent1(this.viewUtils,this,2,this._anchor_2,this._vc_2); }
    if ((nodeIndex == 4)) { return new View_SimpleButtonComponent2(this.viewUtils,this,4,this._anchor_4,this._vc_4); }
    return (null as any);
  }
}