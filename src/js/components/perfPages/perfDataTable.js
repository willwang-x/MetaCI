// @flow

import * as React from 'react';
import { useEffect, useState } from 'react';
import get from 'lodash/get';
import zip from 'lodash/zip';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { AppState } from 'store';
import type { PerfDataState, LoadingStatus } from 'store/perfdata/reducer';
import { t } from 'i18next';
// flowlint  untyped-import:off
import Spinner from '@salesforce/design-system-react/components/spinner';
import DataTable from '@salesforce/design-system-react/components/data-table';
import DataTableColumn from '@salesforce/design-system-react/components/data-table/column';
import DataTableCell from '@salesforce/design-system-react/components/data-table/cell';
// flowlint  untyped-import:error

import { perfRESTFetch, perfREST_UI_Fetch } from 'store/perfdata/actions';
import { selectPerfState } from 'store/perfdata/selectors';
import { Trans } from 'react-i18next';

import { QueryParamHelpers } from './perfTableUtils';
import PerfDataTableOptionsUI from './perfTableOptionsUI';
import type { ServerDataFetcher } from './perfPage';
type Props = {|
  fetchServerData: ServerDataFetcher,
  queryparams: QueryParamHelpers,
  perfState: PerfDataState,
  items: {}[],
|};

export const PerfDataTable = ({
  fetchServerData,
  defaults,
  items,
  perfState,
  queryparams,
}: Props) => {
  const changeUrl = queryparams.set;

  /*
   * Extract the page from the server-generated URL and ensure it is
   * browser URL before fetching it.
   */
  const goPageFromUrl = (url: string) => {
    const qs = url.split('?', 2)[1];
    const qParts = queryString.parse(qs);
    const page = qParts.page;
    if (Array.isArray(page)) {
      fetchServerData({ page: page[1] });
    } else if (typeof page === 'string') {
      fetchServerData({ page });
    } else {
      fetchServerData({ page: undefined });
    }
  };

  const page = parseInt(queryparams.get('page') || '1') - 1;
  const custom_page_size = queryparams.get('page_size');
  const count = get(perfState, 'perfdata.count') || -1;
  const page_size = custom_page_size
    ? parseInt(custom_page_size)
    : get(perfState, 'perfdata.results.length') || null;
  const previousPage: string = get(perfState, 'perfdata.previous') || '';
  const nextPage: string = get(perfState, 'perfdata.next') || '';

  /* https://appexchange.salesforce.com/listingDetail?listingId=a0N3A00000E9TBZUA3 */
  const PerfDataTableFooter = () => (
    <div className="slds-card__footer slds-grid">
      {items.length > 0 && perfState && Boolean(perfState.perfdata) && (
        <>
          <div
            className="slds-col slds-size--1-of-2"
            style={{ textAlign: 'left' }}
          >
            {t('Showing')} {(page * page_size).toString()}
            {t(' to ')}
            {Math.min((page + 1) * page_size, count)}
            {t(' of ')}
            {count.toString()} {t('records')}
          </div>
          <div className="slds-col slds-size--1-of-2">
            <button
              onClick={() => goPageFromUrl(previousPage)}
              className="slds-button slds-button--brand"
              disabled={!previousPage}
            >
              Previous
            </button>
            <button
              onClick={() => goPageFromUrl(nextPage)}
              className="slds-button slds-button--brand"
              disabled={!nextPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );

  const columns = () => {
    let columns;
    if (items.length > 0) {
      const columnIds = Object.keys(items[0]).filter(item => item != 'id');
      const columnPairs = columnIds.map(id => [id, id]);
      return columnPairs;
    }
    // these are really just for looks. If there are no items, they
    // don't matter.
    const default_columns = queryparams.getList('include_fields') || [
      'Method Name',
      'Duration',
    ];
    return zip(default_columns, default_columns);
  };

  const PerfDataColumns = () =>
    columns().map(([name, label]) => {
      let isSorted: boolean = false;
      let sortDirection: string | null = null;

      if (queryparams.get('o') === name) {
        isSorted = true;
        sortDirection = 'asc';
      } else if (queryparams.get('o') === `-${name}`) {
        isSorted = true;
        sortDirection = 'desc';
      }

      return (
        <DataTableColumn
          key={name}
          label={label}
          property={name}
          sortable
          isSorted={isSorted}
          sortDirection={sortDirection}
        />
      );
    });

  const doSort = (sortColumn, ...rest) => {
    let sortProperty = sortColumn.property;
    const sortDirection = sortColumn.sortDirection;

    if (sortDirection === 'desc') {
      sortProperty = `-${sortProperty}`;
    }
    fetchServerData({ o: sortProperty, page: '1' });
  };
  return (
    <div key="perfContainerDiv">
      <div style={{ position: 'relative' }}>
        <PerfDataTableSpinner status={perfState && perfState.status} />
        <DataTable
          items={items}
          fixedLayout={true}
          onSort={doSort}
          id="perfDataTable"
        >
          {PerfDataColumns()}
        </DataTable>
        <PerfDataTableFooter />
      </div>
    </div>
  );
};

type SpinnerProps = {
  status: LoadingStatus,
};

const PerfDataTableSpinner = ({ status }) => {
  if (status === 'LOADING') {
    return (
      <Spinner
        size="small"
        variant="base"
        assistiveText={{ label: 'Small spinner' }}
      />
    );
  }
  return null;
};

export default PerfDataTable;