import type {StyleSpecification} from "maplibre-gl";

export class RevisionStore {
  revisions: (StyleSpecification & {id: string})[];
  currentIdx: number;


  constructor(initialRevisions=[]) {
    this.revisions = initialRevisions
    this.currentIdx = initialRevisions.length - 1
  }

  get latest() {
    return this.revisions[this.revisions.length - 1]
  }

  get current() {
    return this.revisions[this.currentIdx]
  }

  addRevision(revision: StyleSpecification & {id: string}) {
    // clear any "redo" revisions once a change is made
    // and ensure current index is at end of list
    this.revisions = this.revisions.slice(0, this.currentIdx + 1);

    this.revisions.push(revision)
    this.currentIdx++
    //}
  }

  undo() {
    if(this.currentIdx > 0) {
      this.currentIdx--;
    }
    return this.current;
  }

  redo() {
    if(this.currentIdx < this.revisions.length - 1) {
      this.currentIdx++
    }
    return this.current;
  }
}
