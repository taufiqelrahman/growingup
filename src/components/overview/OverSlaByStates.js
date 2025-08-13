import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardHeader, CardBody, CardFooter } from 'shards-react';

import Chart from '../../utils/chart';

const OverSlaByStates = (props) => {
  const { title, books, timeFilter } = props;
  const [canvas, setCanvas] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    if (canvas) canvas.destroy();
    if (books.total === 0) {
      if (canvas) setCanvas(null);
      return;
    }
    const chartData = {
      datasets: [
        {
          hoverBorderColor: '#ffffff',
          data: [books.sent, books.ongoing],
          backgroundColor: ['#ffc107', '#dc3545'],
        },
      ],
      labels: ['Sent', 'On Going'],
    };
    const chartConfig = {
      type: 'pie',
      data: chartData,
      options: {
        ...{
          legend: {
            position: 'bottom',
            labels: {
              padding: 25,
              boxWidth: 20,
            },
          },
          cutoutPercentage: 0,
          tooltips: {
            custom: false,
            mode: 'index',
            position: 'nearest',
          },
        },
        ...props.chartOptions,
      },
    };

    setCanvas(new Chart(canvasRef.current, chartConfig));
  }, [books, timeFilter]);

  return (
    <Card small className="h-100">
      <CardHeader className="border-bottom">
        <h6 className="m-0">{title}</h6>
      </CardHeader>
      <CardBody className="d-flex py-2">
        {books.total > 0 ? (
          <canvas height="220" ref={canvasRef} className="blog-users-by-device m-auto" />
        ) : (
          'Data not available'
        )}
      </CardBody>
      {books.total > 0 && (
        <CardFooter className="border-top">
          <Row>
            <Col>Total books</Col>
            <Col className="text-right view-report">{books.total}</Col>
          </Row>
        </CardFooter>
      )}
    </Card>
  );
};

OverSlaByStates.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart config object.
   */
  chartConfig: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
  books: PropTypes.object,
  timeFilter: PropTypes.object,
};

OverSlaByStates.defaultProps = {
  title: 'Over Sla By States',
};

export default OverSlaByStates;
