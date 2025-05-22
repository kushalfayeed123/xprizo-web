import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Products } from 'src/app/state/products/products.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'xprizo-frontend';

  constructor(private store: Store) {}

  ngOnInit() {
    // Load products only once when the app starts
    this.store.dispatch(new Products.LoadProducts()).subscribe();
  }
}
