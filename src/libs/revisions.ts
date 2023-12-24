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
    //TODO: compare new revision style id with old ones
    //and ensure that it is always the same id
    this.revisions.push(revision)
    this.currentIdx++
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
