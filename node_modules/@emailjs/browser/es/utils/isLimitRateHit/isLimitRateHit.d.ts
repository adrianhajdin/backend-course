import type { LimitRate } from '../../types/LimitRate';
import type { StorageProvider } from '../../types/StorageProvider';
export declare const isLimitRateHit: (defaultID: string, options: LimitRate, storage?: StorageProvider) => Promise<boolean>;
