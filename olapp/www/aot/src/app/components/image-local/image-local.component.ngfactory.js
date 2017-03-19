/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
/* tslint:disable */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/components/image-local/image-local.component';
import * as import1 from '@angular/core/src/change_detection/change_detection_util';
import * as import2 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import5 from '@angular/core/src/metadata/view';
import * as import6 from '@angular/core/src/linker/view_type';
import * as import7 from '@angular/core/src/change_detection/constants';
import * as import8 from '@angular/core/src/linker/component_factory';
import * as import9 from '../../../../../src/app/services/cloud.service';
import * as import10 from './image-local.component.css.shim.ngstyle';
import * as import11 from '@angular/core/src/linker/view_container';
import * as import12 from '@angular/core/src/security';
import * as import13 from '../../../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import14 from '@angular/core/src/linker/template_ref';
import * as import15 from '@angular/common/src/directives/ng_if';
export var Wrapper_ImageLocalComponent = (function () {
    function Wrapper_ImageLocalComponent(p0) {
        this._changed = false;
        this.context = new import0.ImageLocalComponent(p0);
        this._expr_0 = import1.UNINITIALIZED;
        this._expr_1 = import1.UNINITIALIZED;
        this._expr_2 = import1.UNINITIALIZED;
        this._expr_3 = import1.UNINITIALIZED;
    }
    Wrapper_ImageLocalComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_ImageLocalComponent.prototype.ngOnDestroy = function () {
        (this.subscription0 && this.subscription0.unsubscribe());
    };
    Wrapper_ImageLocalComponent.prototype.check_source = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || import3.checkBinding(throwOnChange, this._expr_0, currValue))) {
            this._changed = true;
            this.context.source = currValue;
            this._expr_0 = currValue;
        }
    };
    Wrapper_ImageLocalComponent.prototype.check_height = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || import3.checkBinding(throwOnChange, this._expr_1, currValue))) {
            this._changed = true;
            this.context.height = currValue;
            this._expr_1 = currValue;
        }
    };
    Wrapper_ImageLocalComponent.prototype.check_width = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || import3.checkBinding(throwOnChange, this._expr_2, currValue))) {
            this._changed = true;
            this.context.width = currValue;
            this._expr_2 = currValue;
        }
    };
    Wrapper_ImageLocalComponent.prototype.check_class = function (currValue, throwOnChange, forceUpdate) {
        if ((forceUpdate || import3.checkBinding(throwOnChange, this._expr_3, currValue))) {
            this._changed = true;
            this.context.class = currValue;
            this._expr_3 = currValue;
        }
    };
    Wrapper_ImageLocalComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_ImageLocalComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_ImageLocalComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_ImageLocalComponent.prototype.subscribe = function (view, _eventHandler, emit0) {
        this._eventHandler = _eventHandler;
        if (emit0) {
            (this.subscription0 = this.context.clickImage.subscribe(_eventHandler.bind(view, 'clickImage')));
        }
    };
    return Wrapper_ImageLocalComponent;
}());
var renderType_ImageLocalComponent_Host = import3.createRenderComponentType('', 0, import5.ViewEncapsulation.None, [], {});
var View_ImageLocalComponent_Host0 = (function (_super) {
    __extends(View_ImageLocalComponent_Host0, _super);
    function View_ImageLocalComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ImageLocalComponent_Host0, renderType_ImageLocalComponent_Host, import6.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import7.ChangeDetectorStatus.CheckAlways);
    }
    View_ImageLocalComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'image-local', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_ImageLocalComponent0(this.viewUtils, this, 0, this._el_0);
        this._ImageLocalComponent_0_3 = new Wrapper_ImageLocalComponent(this.injectorGet(import9.CloudService, this.parentIndex));
        this.compView_0.create(this._ImageLocalComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import8.ComponentRef_(0, this, this._el_0, this._ImageLocalComponent_0_3.context);
    };
    View_ImageLocalComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.ImageLocalComponent) && (0 === requestNodeIndex))) {
            return this._ImageLocalComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_ImageLocalComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._ImageLocalComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.internalDetectChanges(throwOnChange);
    };
    View_ImageLocalComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
        this._ImageLocalComponent_0_3.ngOnDestroy();
    };
    View_ImageLocalComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ImageLocalComponent_Host0;
}(import2.AppView));
export var ImageLocalComponentNgFactory = new import8.ComponentFactory('image-local', View_ImageLocalComponent_Host0, import0.ImageLocalComponent);
var styles_ImageLocalComponent = [import10.styles];
var View_ImageLocalComponent1 = (function (_super) {
    __extends(View_ImageLocalComponent1, _super);
    function View_ImageLocalComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ImageLocalComponent1, renderType_ImageLocalComponent, import6.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import7.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_4 = import1.UNINITIALIZED;
        this._expr_5 = import1.UNINITIALIZED;
        this._expr_6 = import1.UNINITIALIZED;
        this._expr_7 = import1.UNINITIALIZED;
    }
    View_ImageLocalComponent1.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'span', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'img', import3.EMPTY_INLINE_ARRAY, null);
        this._text_3 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_2, new import3.InlineArray2(2, 'click', null), this.eventHandler(this.handleEvent_2));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3
        ]), [disposable_0]);
        return null;
    };
    View_ImageLocalComponent1.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_4 = this.parentView.context.fullSrc;
        if (import3.checkBinding(throwOnChange, this._expr_4, currVal_4)) {
            this.renderer.setElementProperty(this._el_2, 'src', this.viewUtils.sanitizer.sanitize(import12.SecurityContext.URL, currVal_4));
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.parentView.context.height;
        if (import3.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setElementProperty(this._el_2, 'height', currVal_5);
            this._expr_5 = currVal_5;
        }
        var currVal_6 = this.parentView.context.width;
        if (import3.checkBinding(throwOnChange, this._expr_6, currVal_6)) {
            this.renderer.setElementProperty(this._el_2, 'width', currVal_6);
            this._expr_6 = currVal_6;
        }
        var currVal_7 = this.parentView.context.class;
        if (import3.checkBinding(throwOnChange, this._expr_7, currVal_7)) {
            this.renderer.setElementProperty(this._el_2, 'className', currVal_7);
            this._expr_7 = currVal_7;
        }
    };
    View_ImageLocalComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ImageLocalComponent1.prototype.handleEvent_2 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.onClick() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ImageLocalComponent1;
}(import2.AppView));
var View_ImageLocalComponent2 = (function (_super) {
    __extends(View_ImageLocalComponent2, _super);
    function View_ImageLocalComponent2(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ImageLocalComponent2, renderType_ImageLocalComponent, import6.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import7.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_4 = import1.UNINITIALIZED;
        this._expr_5 = import1.UNINITIALIZED;
        this._expr_6 = import1.UNINITIALIZED;
    }
    View_ImageLocalComponent2.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'span', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'img', import3.EMPTY_INLINE_ARRAY, null);
        this._text_3 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_2, new import3.InlineArray2(2, 'click', null), this.eventHandler(this.handleEvent_2));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3
        ]), [disposable_0]);
        return null;
    };
    View_ImageLocalComponent2.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_4 = this.parentView.context.fullSrc;
        if (import3.checkBinding(throwOnChange, this._expr_4, currVal_4)) {
            this.renderer.setElementProperty(this._el_2, 'src', this.viewUtils.sanitizer.sanitize(import12.SecurityContext.URL, currVal_4));
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.parentView.context.width;
        if (import3.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setElementProperty(this._el_2, 'width', currVal_5);
            this._expr_5 = currVal_5;
        }
        var currVal_6 = this.parentView.context.class;
        if (import3.checkBinding(throwOnChange, this._expr_6, currVal_6)) {
            this.renderer.setElementProperty(this._el_2, 'className', currVal_6);
            this._expr_6 = currVal_6;
        }
    };
    View_ImageLocalComponent2.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ImageLocalComponent2.prototype.handleEvent_2 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.onClick() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ImageLocalComponent2;
}(import2.AppView));
var View_ImageLocalComponent3 = (function (_super) {
    __extends(View_ImageLocalComponent3, _super);
    function View_ImageLocalComponent3(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ImageLocalComponent3, renderType_ImageLocalComponent, import6.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import7.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_4 = import1.UNINITIALIZED;
        this._expr_5 = import1.UNINITIALIZED;
        this._expr_6 = import1.UNINITIALIZED;
    }
    View_ImageLocalComponent3.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'span', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'img', import3.EMPTY_INLINE_ARRAY, null);
        this._text_3 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_2, new import3.InlineArray2(2, 'click', null), this.eventHandler(this.handleEvent_2));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3
        ]), [disposable_0]);
        return null;
    };
    View_ImageLocalComponent3.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_4 = this.parentView.context.fullSrc;
        if (import3.checkBinding(throwOnChange, this._expr_4, currVal_4)) {
            this.renderer.setElementProperty(this._el_2, 'src', this.viewUtils.sanitizer.sanitize(import12.SecurityContext.URL, currVal_4));
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.parentView.context.height;
        if (import3.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setElementProperty(this._el_2, 'height', currVal_5);
            this._expr_5 = currVal_5;
        }
        var currVal_6 = this.parentView.context.class;
        if (import3.checkBinding(throwOnChange, this._expr_6, currVal_6)) {
            this.renderer.setElementProperty(this._el_2, 'className', currVal_6);
            this._expr_6 = currVal_6;
        }
    };
    View_ImageLocalComponent3.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ImageLocalComponent3.prototype.handleEvent_2 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.onClick() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ImageLocalComponent3;
}(import2.AppView));
var View_ImageLocalComponent4 = (function (_super) {
    __extends(View_ImageLocalComponent4, _super);
    function View_ImageLocalComponent4(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ImageLocalComponent4, renderType_ImageLocalComponent, import6.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import7.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_4 = import1.UNINITIALIZED;
        this._expr_5 = import1.UNINITIALIZED;
    }
    View_ImageLocalComponent4.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'span', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'img', import3.EMPTY_INLINE_ARRAY, null);
        this._text_3 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_2, new import3.InlineArray2(2, 'click', null), this.eventHandler(this.handleEvent_2));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3
        ]), [disposable_0]);
        return null;
    };
    View_ImageLocalComponent4.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_4 = this.parentView.context.fullSrc;
        if (import3.checkBinding(throwOnChange, this._expr_4, currVal_4)) {
            this.renderer.setElementProperty(this._el_2, 'src', this.viewUtils.sanitizer.sanitize(import12.SecurityContext.URL, currVal_4));
            this._expr_4 = currVal_4;
        }
        var currVal_5 = this.parentView.context.class;
        if (import3.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setElementProperty(this._el_2, 'className', currVal_5);
            this._expr_5 = currVal_5;
        }
    };
    View_ImageLocalComponent4.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ImageLocalComponent4.prototype.handleEvent_2 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = (this.parentView.context.onClick() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ImageLocalComponent4;
}(import2.AppView));
var renderType_ImageLocalComponent = import3.createRenderComponentType('', 0, import5.ViewEncapsulation.Emulated, styles_ImageLocalComponent, {});
export var View_ImageLocalComponent0 = (function (_super) {
    __extends(View_ImageLocalComponent0, _super);
    function View_ImageLocalComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ImageLocalComponent0, renderType_ImageLocalComponent, import6.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import7.ChangeDetectorStatus.CheckAlways);
    }
    View_ImageLocalComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._anchor_0 = this.renderer.createTemplateAnchor(parentRenderNode, null);
        this._vc_0 = new import11.ViewContainer(0, null, this, this._anchor_0);
        this._TemplateRef_0_5 = new import14.TemplateRef_(this, 0, this._anchor_0);
        this._NgIf_0_6 = new import13.Wrapper_NgIf(this._vc_0.vcRef, this._TemplateRef_0_5);
        this._text_1 = this.renderer.createText(parentRenderNode, '\n', null);
        this._anchor_2 = this.renderer.createTemplateAnchor(parentRenderNode, null);
        this._vc_2 = new import11.ViewContainer(2, null, this, this._anchor_2);
        this._TemplateRef_2_5 = new import14.TemplateRef_(this, 2, this._anchor_2);
        this._NgIf_2_6 = new import13.Wrapper_NgIf(this._vc_2.vcRef, this._TemplateRef_2_5);
        this._text_3 = this.renderer.createText(parentRenderNode, '\n', null);
        this._anchor_4 = this.renderer.createTemplateAnchor(parentRenderNode, null);
        this._vc_4 = new import11.ViewContainer(4, null, this, this._anchor_4);
        this._TemplateRef_4_5 = new import14.TemplateRef_(this, 4, this._anchor_4);
        this._NgIf_4_6 = new import13.Wrapper_NgIf(this._vc_4.vcRef, this._TemplateRef_4_5);
        this._text_5 = this.renderer.createText(parentRenderNode, '\n', null);
        this._anchor_6 = this.renderer.createTemplateAnchor(parentRenderNode, null);
        this._vc_6 = new import11.ViewContainer(6, null, this, this._anchor_6);
        this._TemplateRef_6_5 = new import14.TemplateRef_(this, 6, this._anchor_6);
        this._NgIf_6_6 = new import13.Wrapper_NgIf(this._vc_6.vcRef, this._TemplateRef_6_5);
        this._text_7 = this.renderer.createText(parentRenderNode, '\n', null);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._anchor_0,
            this._text_1,
            this._anchor_2,
            this._text_3,
            this._anchor_4,
            this._text_5,
            this._anchor_6,
            this._text_7
        ]), null);
        return null;
    };
    View_ImageLocalComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import14.TemplateRef) && (0 === requestNodeIndex))) {
            return this._TemplateRef_0_5;
        }
        if (((token === import15.NgIf) && (0 === requestNodeIndex))) {
            return this._NgIf_0_6.context;
        }
        if (((token === import14.TemplateRef) && (2 === requestNodeIndex))) {
            return this._TemplateRef_2_5;
        }
        if (((token === import15.NgIf) && (2 === requestNodeIndex))) {
            return this._NgIf_2_6.context;
        }
        if (((token === import14.TemplateRef) && (4 === requestNodeIndex))) {
            return this._TemplateRef_4_5;
        }
        if (((token === import15.NgIf) && (4 === requestNodeIndex))) {
            return this._NgIf_4_6.context;
        }
        if (((token === import14.TemplateRef) && (6 === requestNodeIndex))) {
            return this._TemplateRef_6_5;
        }
        if (((token === import15.NgIf) && (6 === requestNodeIndex))) {
            return this._NgIf_6_6.context;
        }
        return notFoundResult;
    };
    View_ImageLocalComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_0_0_0 = (('-2' != this.context.height) && ('-2' != this.context.width));
        this._NgIf_0_6.check_ngIf(currVal_0_0_0, throwOnChange, false);
        this._NgIf_0_6.ngDoCheck(this, this._anchor_0, throwOnChange);
        var currVal_2_0_0 = (('-2' == this.context.height) && ('-2' != this.context.width));
        this._NgIf_2_6.check_ngIf(currVal_2_0_0, throwOnChange, false);
        this._NgIf_2_6.ngDoCheck(this, this._anchor_2, throwOnChange);
        var currVal_4_0_0 = (('-2' != this.context.height) && ('-2' == this.context.width));
        this._NgIf_4_6.check_ngIf(currVal_4_0_0, throwOnChange, false);
        this._NgIf_4_6.ngDoCheck(this, this._anchor_4, throwOnChange);
        var currVal_6_0_0 = (('-2' == this.context.height) && ('-2' == this.context.width));
        this._NgIf_6_6.check_ngIf(currVal_6_0_0, throwOnChange, false);
        this._NgIf_6_6.ngDoCheck(this, this._anchor_6, throwOnChange);
        this._vc_0.detectChangesInNestedViews(throwOnChange);
        this._vc_2.detectChangesInNestedViews(throwOnChange);
        this._vc_4.detectChangesInNestedViews(throwOnChange);
        this._vc_6.detectChangesInNestedViews(throwOnChange);
    };
    View_ImageLocalComponent0.prototype.destroyInternal = function () {
        this._vc_0.destroyNestedViews();
        this._vc_2.destroyNestedViews();
        this._vc_4.destroyNestedViews();
        this._vc_6.destroyNestedViews();
    };
    View_ImageLocalComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 0)) {
            return new View_ImageLocalComponent1(this.viewUtils, this, 0, this._anchor_0, this._vc_0);
        }
        if ((nodeIndex == 2)) {
            return new View_ImageLocalComponent2(this.viewUtils, this, 2, this._anchor_2, this._vc_2);
        }
        if ((nodeIndex == 4)) {
            return new View_ImageLocalComponent3(this.viewUtils, this, 4, this._anchor_4, this._vc_4);
        }
        if ((nodeIndex == 6)) {
            return new View_ImageLocalComponent4(this.viewUtils, this, 6, this._anchor_6, this._vc_6);
        }
        return null;
    };
    return View_ImageLocalComponent0;
}(import2.AppView));
//# sourceMappingURL=image-local.component.ngfactory.js.map