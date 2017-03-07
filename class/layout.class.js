export default new class {
  constructor(wrap) {
    this.wrap = wrap || false;
  }
  free(wrap){
    console.log(wrap);
    if(!wrap) return false;
    console.log(wrap);
  }
}
