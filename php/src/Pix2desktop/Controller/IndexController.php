<?php

namespace Pix2desktop\Controller;

use BaconQrCode\Renderer\Image\Png;
use BaconQrCode\Writer;
use Predis\Client;
use Silex\Api\ControllerProviderInterface;
use Silex\Application;
use Silex\ControllerCollection;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class IndexController
 * @package Pix2desktop\Controller
 * @author antoine@lierville.com
 */
class IndexController implements ControllerProviderInterface
{

    /**
     * @param Application $app
     * @return ControllerCollection
     * @see \Silex\ControllerProviderInterface::connect()
     */
    public function connect(Application $app)
    {

        /** @var ControllerCollection $aControllers */
        $aControllers = $app['controllers_factory'];

        // Routes
        $aControllers->get('/', [$this, 'indexAction']);
        $aControllers->get('/qr/{id}', [$this, 'generateQRAction']);
        $aControllers->post('/upload', [$this, 'uploadAction']);

        return $aControllers;
    }

    /**
     * @param Request $request
     * @param Application $app
     * @return string
     */
    public function indexAction(Request $request, Application $app)
    {
        return new Response('ok');
    }

    /**
     * Return QR code as PNG image containing url to reach mobile uploader
     *
     * @param Request $request
     * @param Application $app
     * @return Response
     */
    public function generateQRAction(Request $request, Application $app)
    {
        $id = $request->get('id');

        if (!preg_match('/([A-Za-z0-9]{6})/', $id))
            return $app->json(['success' => false, 'error' => 'ID FORMAT IS INCORRECT'], 400);

        //Generate QR image
        $renderer = new Png();
        $renderer->setHeight(500);
        $renderer->setWidth(500);
        $writer = new Writer($renderer);

        return new Response($writer->writeString( $app['config']['api_url'] . 'upload/' . $id), 200, ['Content-Type' => 'image/png']);
    }

    public function uploadAction(Request $request, Application $app)
    {
        /** @var Client $redisClient */
        $redisClient = $app['predis'];
        $redisClient->publish('pix2desktop', json_encode(
            [
                'status' => 'image_received'
                , 'uniqueID' => $request->get('uniqueID')
                , 'image' => $request->get('image')
            ]
        ));

        //here goes handler for image

        return $app->json(['success' => true], 200);
    }

}