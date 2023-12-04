/***/
/**
 * Common functionalities for the kkday-entities plugin.
 *
 * @packageDocumentation
 */

/**
 * In this package you might for example declare types that are common
 * between the frontend and backend plugin packages.
 */
export {
  systemEntityV1alpha1Validator,
  isSystemEntityV1alpha1,
} from './SystemEntityV1alpha1';
export type {
  SystemEntityV1alpha1
} from './SystemEntityV1alpha1';
export { KKEntitiesProcessor } from './processor/KKEntitiesProcessor';
