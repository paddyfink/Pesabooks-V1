import { HostModule } from './host.module';

describe('HostModule', () => {
  let hostModule: HostModule;

  beforeEach(() => {
    hostModule = new HostModule();
  });

  it('should create an instance', () => {
    expect(hostModule).toBeTruthy();
  });
});
