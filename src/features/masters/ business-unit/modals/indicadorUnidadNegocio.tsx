import classNames from 'classnames'
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik'
import React, { useState } from 'react'
import Select from 'react-select'
import * as Yup from 'yup'

import { useGetMasterOptions } from '@/hooks/useGetMasterOptions'

import { Separator } from '../ui/separator'

interface FormValues {
  id: number
  nombre: string | null
  codigo: string | null
  pais: number | null
  // zona: number[]
  administracion: number[]
  kmTroncal: number
  kmCarrilTroncal: number
  kmRamales: number
  kmCarrilRamales: number
  m2PavimentoTroncal: number
  m2PavimentoRamales: number
  noEstructuras: number
  m2Estructuras: number
  TDPA: number
  TDPAPesados: number

  fechaAlta: string | null
  fechaBaja: string | null
  activo: boolean

  ratioOneYearsBefore?: number
  ratioTwoYearsBefore?: number
  ratiotTreeYearsBefore?: number
}

interface FormProps {
  buttonText: string
  initValue: any
  onSubmit: Function
}

interface Option {
  label: string
  value: any
}

const initialValues: FormValues = {
  id: 0,
  nombre: null,
  codigo: null,
  pais: null,
  // zona: [],
  administracion: [],
  kmTroncal: 0,
  kmCarrilTroncal: 0,
  kmRamales: 0,
  kmCarrilRamales: 0,
  m2PavimentoTroncal: 0,
  m2PavimentoRamales: 0,
  noEstructuras: 0,
  m2Estructuras: 0,
  TDPA: 0,
  TDPAPesados: 0,

  fechaAlta: null,
  fechaBaja: null,
  activo: false,

  ratioOneYearsBefore: undefined,
  ratioTwoYearsBefore: undefined,
  ratiotTreeYearsBefore: undefined,
}

const SchemaForm = Yup.object().shape({
  // udObraSimple: Yup.string().trim().min(1, 'Demasiado corto!').max(70, 'Demasiado largo!').required('Requerido'),
  nombre: Yup.string()
    .trim()
    .min(2, 'Demasiado corto!')
    .max(80, 'Demasiado largo!')
    .required('Requerido'),
  codigo: Yup.string()
    .trim()
    .min(1, 'Demasiado corto!')
    .max(80, 'Demasiado largo!')
    .required('Requerido'),
  pais: Yup.number().required('Requerido'),

  administracion: Yup.array().test(
    'La zona pertenece al pais',
    'La zona actual no pertenece al pais',
    function (value) {
      const { administracion, pais }: any = this.parent
      if (pais !== undefined && administracion !== undefined) {
        return (
          administracion.filter((item: any) => item.countryId == pais).length >
          0
        )
      }

      return false
    },
  ),

  kmTroncal: Yup.number().required('Requerido'),
  kmCarrilTroncal: Yup.number().required('Requerido'),
  kmRamales: Yup.number().required('Requerido'),
  kmCarrilRamales: Yup.number().required('Requerido'),
  m2PavimentoTroncal: Yup.number().required('Requerido'),
  m2PavimentoRamales: Yup.number().required('Requerido'),
  noEstructuras: Yup.number().required('Requerido'),
  m2Estructuras: Yup.number().required('Requerido'),
  TDPA: Yup.number().required('Requerido'),
  TDPAPesados: Yup.number().required('Requerido'),

  fechaAlta: Yup.string()
    .min(2, 'Demasiado corto!')
    .max(80, 'Demasiado largo!')
    .required('Requerido'),
  fechaBaja: Yup.string()
    .min(2, 'Demasiado corto!')
    .max(80, 'Demasiado largo!')
    .required('Requerido'),

  ratioOneYearsBefore: Yup.number()
    .optional()
    .positive()
    .nullable()
    .test('2 decimales como máximo', (value) =>
      value ? /^\d+(\.\d{1,2})?$/.test(value.toString()) : true,
    ),
  ratioTwoYearsBefore: Yup.number()
    .optional()
    .positive()
    .nullable()
    .test('2 decimales como máximo', (value) =>
      value ? /^\d+(\.\d{1,2})?$/.test(value.toString()) : true,
    ),
  ratiotTreeYearsBefore: Yup.number()
    .optional()
    .positive()
    .nullable()
    .test('2 decimales como máximo', (value) =>
      value ? /^\d+(\.\d{1,2})?$/.test(value.toString()) : true,
    ),
})

function IndicadorUnidadNegocio(props: FormProps) {
  const { countryOptions, zoneOptions, administrationOptions } =
    useGetMasterOptions()

  const handleOnSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    submitEnquiryForm({ ...values })

    formikHelpers.resetForm()
  }

  const submitEnquiryForm = async (values: FormValues): Promise<any> => {
    try {
      if (typeof props.onSubmit === 'function') {
        await props.onSubmit(values)
      }
    } catch (e) {
      console.log('Error', e)
    }
  }

  const customStyleSelect = (isValid: boolean) => {
    return {
      control: (base: any) => ({
        ...base,
        backgroundColor: isValid ? 'rgb(253 232 232)' : '#FFFFFF',
        borderColor: isValid ? 'rgb(249 128 128)' : '#FFFFFF',
      }),
    }
  }
  return (
    <>
      <Formik
        initialValues={props.initValue || initialValues}
        validationSchema={SchemaForm}
        validateOnBlur={false}
        onSubmit={handleOnSubmit}
      >
        {({
          errors,
          touched,
          isSubmitting,
          isValid,
          values,
        }: FormikProps<FormValues>) => (
          <Form>
            <div className="mb-6">
              <label
                htmlFor="nombre"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Agregue nombre
              </label>
              <Field
                disabled={isSubmitting}
                name="nombre"
                className={classNames(
                  'block w-full rounded-lg border p-2.5 text-sm',
                  errors.nombre && touched.nombre
                    ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                    : 'block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900  focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                )}
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="mt-1 text-sm text-red-600 dark:text-red-500"
              />
            </div>
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="codigo"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Agregue código
                </label>
                <Field
                  disabled={isSubmitting}
                  name="codigo"
                  className={classNames(
                    'block w-full rounded-lg border p-2.5 text-sm',
                    errors.codigo && touched.codigo
                      ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                      : 'block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900  focus:border-blue-500 focus:ring-blue-500 focus-visible:border-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                  )}
                />
                <ErrorMessage
                  name="codigo"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
            </div>
            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="pais"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  País
                </label>
                <Field name="pais">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <div>
                      <Select
                        {...field}
                        id="pais"
                        instanceId="pais"
                        placeholder="Seleccione un pais"
                        options={countryOptions}
                        value={countryOptions?.find(
                          (c) => c.value === values.pais,
                        )}
                        onChange={(option: any) => {
                          setFieldValue(
                            field.name,
                            option ? option.value : null,
                          )
                          // setFieldValue('zona', [])
                        }}
                        styles={customStyleSelect(errors.pais && touched.pais)}
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.pais && touched.pais
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'bg-white  text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="pais"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              {/* <div>
                <label
                  htmlFor="zona"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Zona geográfica
                </label>
                <Field name="zona">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => {
                    let zoneOptionsFiltered: {
                      label: string
                      value: number
                      countryId: number
                    }[] = []

                    if (values.pais && zoneOptions) {
                      zoneOptionsFiltered = zoneOptions.filter(
                        (item) => item.countryId === values.pais,
                      )
                    }

                    return (
                      <Select
                        {...field}
                        id="zona"
                        instanceId="zona"
                        isDisabled={!values.pais}
                        isMulti
                        placeholder="Seleccione zona geográfica"
                        options={zoneOptionsFiltered}
                        value={value}
                        onChange={(option: any) =>
                          setFieldValue(field.name, [...option])
                        }
                        defaultValue={
                          props.initValue != null ? props.initValue.zona : []
                        }
                        styles={customStyleSelect(errors.zona && touched.zona)}
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.zona && touched.zona
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'bg-gray-100  text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    )
                  }}
                </Field>
                <ErrorMessage
                  name="zona"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div> */}

              <div>
                <label
                  htmlFor="administracion"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Administracion
                </label>
                <Field name="administracion">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <div>
                      <Select
                        {...field}
                        id="administracion"
                        instanceId="administracion"
                        placeholder="Seleccione administracion"
                        isMulti
                        options={
                          administrationOptions
                            ? administrationOptions.filter(
                                (item) => item.countryId === values.pais,
                              )
                            : []
                        }
                        value={value}
                        onChange={(option: any) =>
                          setFieldValue(field.name, [...option])
                        }
                        defaultValue={
                          props.initValue != null
                            ? props.initValue.administracion
                            : []
                        }
                        styles={customStyleSelect(
                          errors.administracion && touched.administracion,
                        )}
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.administracion && touched.administracion
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'bg-gray-100  text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="administracion"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
            </div>
            <div className="mb-6 grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="kmTroncal"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Km troncal
                </label>
                <Field name="kmTroncal">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={props.initValue != null ? values.kmTroncal : value}
                      onChange={(evt) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.kmTroncal && touched.kmTroncal
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="kmTroncal"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="kmCarrilTroncal"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Km-carril troncal
                </label>
                <Field name="kmCarrilTroncal">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null
                          ? values['kmCarrilTroncal']
                          : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.kmCarrilTroncal && touched.kmCarrilTroncal
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="kmCarrilTroncal"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="kmRamales"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Km ramales km
                </label>
                <Field name="kmRamales">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null ? values['kmRamales'] : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.kmRamales && touched.kmRamales
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="kmRamales"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="kmCarrilRamales"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Km-carril ramales
                </label>
                <Field name="kmCarrilRamales">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null
                          ? values['kmCarrilRamales']
                          : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.kmCarrilRamales && touched.kmCarrilRamales
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="kmCarrilRamales"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="kmCarrilRamales"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Km-carril totales
                </label>
                <Field name="kmCarrilTotales">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => {
                    const sum =
                      Number(values['kmCarrilTroncal']) +
                        Number(values['kmCarrilRamales']) || 0

                    return (
                      <input
                        {...field}
                        disabled={true}
                        type="number"
                        value={sum}
                        // value={
                        //   props.initValue != null
                        //     ? values['kmCarrilRamales']
                        //     : value
                        // }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.valueAsNumber)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.kmCarrilTotales && touched.kmCarrilTotales
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    )
                  }}
                </Field>
                <ErrorMessage
                  name="kmCarrilTotales"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="m2PavimentoTroncal"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  M2 pavimento troncal
                </label>
                <Field name="m2PavimentoTroncal">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null
                          ? values['m2PavimentoTroncal']
                          : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.m2PavimentoTroncal && touched.m2PavimentoTroncal
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="m2PavimentoTroncal"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="m2PavimentoRamales"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  M2 pavimento ramales
                </label>
                <Field name="m2PavimentoRamales">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null
                          ? values['m2PavimentoRamales']
                          : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.m2PavimentoRamales && touched.m2PavimentoRamales
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="m2PavimentoRamales"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="m2PavimentoTotales"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  M2 pavimento totales
                </label>
                <Field name="m2PavimentoTotales">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => {
                    const sum =
                      Number(values['m2PavimentoTroncal']) +
                        Number(values['m2PavimentoRamales']) || 0
                    return (
                      <input
                        {...field}
                        disabled={true}
                        type="number"
                        value={sum}
                        // value={
                        //   props.initValue != null
                        //     ? values['kmCarrilRamales']
                        //     : value
                        // }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.valueAsNumber)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.m2PavimentoTotales &&
                            touched.m2PavimentoTotales
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-gray-200 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    )
                  }}
                </Field>
                <ErrorMessage
                  name="m2PavimentoTotales"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="noEstructuras"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nº Estructuras
                </label>
                <Field name="noEstructuras">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null
                          ? values['noEstructuras']
                          : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.noEstructuras && touched.noEstructuras
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="noEstructuras"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="m2Estructuras"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  M2 Estructuras
                </label>
                <Field name="m2Estructuras">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null
                          ? values['m2Estructuras']
                          : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.m2Estructuras && touched.m2Estructuras
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="m2Estructuras"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="TDPA"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  TDPA
                </label>
                <Field name="TDPA">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={props.initValue != null ? values['TDPA'] : value}
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.TDPA && touched.TDPA
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="TDPA"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <label
                  htmlFor="TDPAPesados"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  TDPA Pesados
                </label>
                <Field name="TDPAPesados">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <input
                      {...field}
                      type="number"
                      value={
                        props.initValue != null ? values['TDPAPesados'] : value
                      }
                      onChange={(evt: any) =>
                        setFieldValue(field.name, evt.target.valueAsNumber)
                      }
                      className={classNames(
                        'block w-full rounded-lg border text-sm',
                        errors.TDPAPesados && touched.TDPAPesados
                          ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                      )}
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="TDPAPesados"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
            </div>
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fechaAlta"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Fecha de alta
                </label>
                <Field name="fechaAlta">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <div>
                      <input
                        id={`fechaAlta}`}
                        type="date"
                        value={
                          props.initValue != null ? values['fechaAlta'] : value
                        }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.value)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.fechaAlta && touched.fechaAlta
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-white  text-gray-900 focus:border-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="fechaAlta"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="fechaBaja"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Fecha de baja
                </label>
                <Field name="fechaBaja">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <div>
                      <input
                        id={`fechaBaja}`}
                        type="date"
                        value={
                          props.initValue != null ? values['fechaBaja'] : value
                        }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.value)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.fechaBaja && touched.fechaBaja
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-white  text-gray-900 focus:border-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="fechaBaja"
                  component="div"
                  className="mt-1 text-sm text-red-600 dark:text-red-500"
                />
              </div>
              <div>
                <Field name="activo">
                  {({
                    field, // { name, value, onChange, onBlur }
                    value,
                    form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                    meta,
                  }: any) => (
                    <div>
                      <div className="flex items-center rounded border border-gray-200 pl-4 dark:border-gray-700">
                        <input
                          id="activo"
                          type="checkbox"
                          value={value}
                          name="bordered-checkbox"
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="activo"
                          className="ml-2 w-full py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Activo
                        </label>
                      </div>
                    </div>
                  )}
                </Field>
              </div>
            </div>
            <Separator />{' '}
            <section className="my-4">
              <h3 className="mb-2 font-semibold">Ratios</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="ratioOneYearsBefore"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ratio 1 año antes
                  </label>
                  <Field name="ratioOneYearsBefore">
                    {({
                      field, // { name, value, onChange, onBlur }
                      value,
                      form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (
                      <input
                        {...field}
                        type="number"
                        value={
                          props.initValue != null
                            ? values['ratioOneYearsBefore']
                            : value
                        }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.valueAsNumber)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.ratioOneYearsBefore &&
                            touched.ratioOneYearsBefore
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="ratioOneYearsBefore"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ratioTwoYearsBefore"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ratio 2 años antes
                  </label>
                  <Field name="ratioTwoYearsBefore">
                    {({
                      field, // { name, value, onChange, onBlur }
                      value,
                      form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (
                      <input
                        {...field}
                        type="number"
                        value={
                          props.initValue != null
                            ? values['ratioTwoYearsBefore']
                            : value
                        }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.valueAsNumber)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.ratioTwoYearsBefore &&
                            touched.ratioTwoYearsBefore
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="ratioTwoYearsBefore"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ratiotTreeYearsBefore"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Ratio 3 años antes
                  </label>
                  <Field name="ratiotTreeYearsBefore">
                    {({
                      field, // { name, value, onChange, onBlur }
                      value,
                      form: { touched, errors, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta,
                    }: any) => (
                      <input
                        {...field}
                        type="number"
                        value={
                          props.initValue != null
                            ? values['ratiotTreeYearsBefore']
                            : value
                        }
                        onChange={(evt: any) =>
                          setFieldValue(field.name, evt.target.valueAsNumber)
                        }
                        className={classNames(
                          'block w-full rounded-lg border text-sm',
                          errors.ratiotTreeYearsBefore &&
                            touched.ratiotTreeYearsBefore
                            ? 'border-red-400 bg-red-100 text-red-800 focus:border-red-400 focus:ring-red-400 dark:border-red-600 dark:bg-red-700 dark:text-red-400 dark:placeholder-red-400 dark:focus:border-red-500 dark:focus:ring-red-500'
                            : 'border-gray-300 bg-white text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                        )}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="ratiotTreeYearsBefore"
                    component="div"
                    className="mt-1 text-sm text-red-600 dark:text-red-500"
                  />
                </div>
              </div>
            </section>
            <Separator />{' '}
            <div className="mt-8">
              <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className={classNames(
                  'w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white sm:w-auto',
                  isValid
                    ? 'bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                    : 'border-blue-300 bg-blue-400 text-gray-900 focus:border-gray-400 focus:ring-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500',
                )}
              >
                Guardar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default IndicadorUnidadNegocio
