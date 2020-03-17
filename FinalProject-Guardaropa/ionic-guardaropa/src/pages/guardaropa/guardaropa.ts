import { ViewChild, Component } from '@angular/core';
import { SceneGraph } from '../../components/scenegraph/scenegraph'

@Component({
  templateUrl: 'guardaropa.html',
})
export class GuardaropaPage {

  @ViewChild('scenegraph')
  sceneGraph: SceneGraph;

  constructor() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuardaropaPage');
  }

  ionViewDidEnter() {
    this.sceneGraph.animate();
  }

  ionViewDidLeave() {
    this.sceneGraph.stopAnimation();
  }

}
