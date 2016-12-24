export class RevisionStore {
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

  addRevision(revision) {
    //TODO: compare new revision style id with old ones
    //and ensure that it is always the same id
    this.revisions.push(revision)
    this.currentIdx++
  }

  undo() {
    if(this.currentIdx > 0) {
      this.currentIdx--
    }
    return this.current
  }

  redo() {
    if(this.currentIdx < this.revisions.length - 1) {
      this.currentIdx++
    }
    return this.current
  }
}
