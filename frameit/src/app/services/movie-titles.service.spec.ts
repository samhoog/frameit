import { TestBed } from '@angular/core/testing';

import { MovieTitlesService } from './movie-titles.service';

describe('MovieTitlesService', () => {
  let service: MovieTitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieTitlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
