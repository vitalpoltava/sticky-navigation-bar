## Sticky DOM Element

### Why?

Sometimes we need to be sure an action bar is always visible to the user. There are lots of plugins, which use `position: fixed` style. However, sometimes fixed positioning is not an option. And there is a need to use `position: absolute`. And there are very few plugins, which allow that. So **stickyNavigation** directive fills this gap.

### How to use?

Just add `sticky-navigation` attribute (or class) to the DOM element you want to be sticky. The directive uses the parent element as an 'anchor' (as a trigger to apply 'sticky' styles), but you can provide your own one (see the example layout in `index.html`).
 
### Dependencies

`AngularJS`, `jQuery`, `loDash`.