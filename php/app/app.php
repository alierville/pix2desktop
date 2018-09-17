<?php
/*
 * @author antoine@lierville.com
 */

use Symfony\Component\Yaml\Yaml;

/**
 * Boostrap application
 */
$app = new Silex\Application;
$env = getenv('ENVIRONMENT') ? getenv('ENVIRONMENT') : 'local';
$config = Yaml::parse(file_get_contents(__DIR__ . '/../config/config.' . $env . '.yml'));
$app['debug'] = $config['debug'];
$app['config'] = $config;

/**
 * Dependencies injection
 */
$app->register(new \Predis\Silex\ClientServiceProvider(), [
    'predis.parameters' => $config['predis']['parameters']
]);

/**
 * Mounts
 */
$app->mount('/', new \Pix2desktop\Controller\IndexController);

return $app;
